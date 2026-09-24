<?php

/**
 * InfinityFree hosting limitations and how we work around them:
 *
 * 1. SAME-ORIGIN REQUESTS ONLY
 *    InfinityFree does not send CORS headers, so browsers block cross-origin
 *    requests. To stay within this constraint, the frontend is served from the
 *    SAME host/domain as this API (same-origin), so no CORS preflight is needed.
 *    We therefore do NOT add any CORS headers here — the app must be deployed
 *    on the same InfinityFree domain as this API.
 *
 * 2. ONLY GET AND POST ARE ALLOWED
 *    InfinityFree's web server rejects PUT, PATCH and DELETE requests outright.
 *    To support full CRUD with only GET + POST, we use a "method tunneling"
 *    approach:
 *      - GET  -> used for reading.
 *      - POST -> used for everything else. The real HTTP verb is carried in a
 *                JSON body field named `_method` (e.g. `_method=PUT` or
 *                `_method=DELETE`), and the server dispatches on that value.
 *
 * The JSON body is read once from php://input into $data, and the outer switch
 * routes on the actual request method while the inner switch routes on the
 * tunneled `_method` value.
 */

require_once "../common.php";
header("Content-Type: application/json");
$data = json_decode(file_get_contents("php://input"), true);

// The model used for chat completions via OpenRouter.
$MODEL = "deepseek/deepseek-v4-flash-0731";

/**
 * Looks up a session id by its unique key.
 *
 * @param string $key The session key (sessions.key).
 * @return int|false The session id, or false if no session has that key.
 */
function findSessionId(string $key): int | false {
    global $db;
    $result = executePreparedQuery($db, "SELECT `id` FROM `sessions` WHERE `key` = :key", [":key" => $key]);
    $row = $result->fetchArray();
    if ($row == false) {
        return false;
    }
    return $row["id"];
}

/**
 * Creates a new session and returns its id.
 *
 * @return int The id of the newly created session.
 */
function createSession(): int {
    global $db;
    $key = uniqid("session");
    executePreparedQuery($db, "INSERT INTO `sessions` (`key`) VALUES (:key)", [":key" => $key]);
    $result = $db->query("SELECT last_insert_rowid() AS `id`");
    return $result->fetchArray()["id"];
}

/**
 * Inserts a message into a session.
 *
 * @param int    $sessionId The session id the message belongs to.
 * @param string $role      The message role ('user' or 'assistant').
 * @param string $content   The message content.
 */
function insertMessage(int $sessionId, string $role, string $content) {
    global $db;
    executePreparedQuery(
        $db,
        "INSERT INTO `messages` (`session_id`, `role`, `content`) VALUES (:session_id, :role, :content)",
        [":session_id" => $sessionId, ":role" => $role, ":content" => $content]
    );
}

/**
 * Loads the message row ids for a session, oldest first. Used to map a
 * zero-based message index (index 0 = first/oldest message) to its
 * `messages.id` so messages can be edited or deleted by index.
 *
 * @param int $sessionId The session id.
 * @return array An array of associative arrays with 'id' and 'role'.
 */
function loadMessageIds(int $sessionId): array {
    global $db;
    $result = executePreparedQuery(
        $db,
        "SELECT `id`, `role` FROM `messages` WHERE `session_id` = :session_id ORDER BY `id` ASC",
        [":session_id" => $sessionId]
    );

    $ids = [];
    while ($row = $result->fetchArray()) {
        $ids[] = ["id" => (int) $row["id"], "role" => $row["role"]];
    }
    return $ids;
}

/**
 * Loads the full message history for a session, oldest first.
 *
 * @param int $sessionId The session id.
 * @return array An array of associative arrays with 'role' and 'content'.
 */
function loadHistory(int $sessionId): array {
    global $db;
    $result = executePreparedQuery(
        $db,
        "SELECT `role`, `content` FROM `messages` WHERE `session_id` = :session_id ORDER BY `id` ASC",
        [":session_id" => $sessionId]
    );

    $history = [];
    while ($row = $result->fetchArray()) {
        $history[] = ["role" => $row["role"], "content" => $row["content"]];
    }
    return $history;
}

/**
 * Loads the structured response schema from `assets/response-format.json`.
 *
 * This file is the single source of truth for the shape CHU² must reply in
 * (the `reply`, `edit_board`, and `timeout` variants). It is passed straight
 * through to OpenRouter as the `json_schema` response format so the model and
 * the parser below can never drift apart.
 *
 * @return array An associative array with 'name' (string) and 'schema' (array).
 */
function loadResponseSchema(): array {
    $raw = file_get_contents("../assets/response-format.json");
    $decoded = json_decode($raw, true);

    if (!is_array($decoded) || !isset($decoded["schema"])) {
        throw new RuntimeException("Invalid response-format.json.");
    }

    return [
        "name" => $decoded["name"] ?? "response",
        "schema" => $decoded["schema"]
    ];
}

/**
 * Sends the conversation to OpenRouter and returns the assistant reply.
 *
 * @param array $history The full message history (system prompt already included).
 * @return array An associative array with 'ok' (bool) and either 'content' or 'error'.
 */
function askModel(array $history): array {
    global $OPENROUTER_API_KEY, $MODEL;
    $format = loadResponseSchema();
    $response = fetch("https://openrouter.ai/api/v1/chat/completions", [
        "method" => "POST",
        "headers" => [
            "Content-Type" => "application/json",
            "Authorization" => "Bearer {$OPENROUTER_API_KEY}"
        ],
        "body" => [
            "model" => $MODEL,
            "messages" => $history,
            "reasoning_effort" => "none",
            "response_format" => [
                "type" => "json_schema",
                "json_schema" => [
                    "name" => $format["name"],
                    "strict" => true,
                    "schema" => $format["schema"]
                ]
            ]
        ],
        "timeout" => 120
    ]);

    if ($response["ok"] == false) {
        $error = $response["json"]["error"]["message"] ?? "OpenRouter request failed.";
        return ["ok" => false, "error" => $error];
    }

    $content = $response["json"]["choices"][0]["message"]["content"];
    return ["ok" => true, "content" => $content];
}

/**
 * Parses the assistant's reply into the chat text, an optional board update,
 * and an optional timeout directive. The model replies as JSON matching
 * `assets/response-format.json`, i.e. a single `response` object with one of
 * three variants:
 *
 *     { "response": { "type": "reply",       "reply": "..." } }
 *     { "response": { "type": "edit_board",  "reply": "...", "editType": "append|overwrite", "content": "..." } }
 *     { "response": { "type": "timeout",     "reply": "...", "timeoutType": "hate_speech|horny_jail|general", "reason": "..." } }
 *
 * If the reply is not valid JSON (or lacks a recognised variant), the whole
 * reply is treated as plain chat text and no board change or timeout is made.
 *
 * @param string $content The raw assistant reply.
 * @return array An associative array with:
 *               - 'reply'   (string)      the chat text to show the user.
 *               - 'board'   (string|null) the FULL new board content, or null
 *                                         to leave the board unchanged.
 *               - 'timeout' (array|null)  ['timeoutType' => string,
 *                                         'reason' => string] when the user is
 *                                         being timed out, otherwise null.
 */
function parseResponse(string $content): array {
    $decoded = json_decode($content, true);
    $response = is_array($decoded) ? ($decoded["response"] ?? null) : null;

    if (!is_array($response) || !isset($response["type"])) {
        return ["reply" => $content, "board" => null, "timeout" => null];
    }

    $reply = (isset($response["reply"]) && is_string($response["reply"]))
        ? $response["reply"]
        : "";

    switch ($response["type"]) {
        case "edit_board":
            // Honor the requested edit mode: overwrite replaces the whole board,
            // append adds the content on a new line (per the schema description).
            $editType = $response["editType"] ?? "overwrite";
            $newContent = (isset($response["content"]) && is_string($response["content"]))
                ? $response["content"]
                : "";
            $board = ($editType === "append")
                ? loadBoard() . "\n" . $newContent
                : $newContent;
            return ["reply" => $reply, "board" => $board, "timeout" => null];

        case "timeout":
            $timeoutType = $response["timeoutType"] ?? "general";
            $reason = (isset($response["reason"]) && is_string($response["reason"]))
                ? $response["reason"]
                : "";
            return [
                "reply" => $reply,
                "board" => null,
                "timeout" => ["timeoutType" => $timeoutType, "reason" => $reason]
            ];

        case "reply":
        default:
            return ["reply" => $reply, "board" => null, "timeout" => null];
    }
}

/**
 * Loads the current global textboard content.
 *
 * @return string The current board content (empty string if none).
 */
function loadBoard(): string {
    global $db;
    $result = $db->query("SELECT `content` FROM `textboard` ORDER BY `id` ASC LIMIT 1");
    $row = $result->fetchArray();
    if ($row == false) {
        return "";
    }
    return $row["content"];
}

/**
 * Replaces the global textboard content with the given text.
 *
 * @param string $content The new board content.
 */
function saveBoard(string $content) {
    global $db;
    executePreparedQuery(
        $db,
        "UPDATE `textboard` SET `content` = :content, `updated_at` = datetime() WHERE `id` = (SELECT `id` FROM `textboard` ORDER BY `id` ASC LIMIT 1)",
        [":content" => $content]
    );
}

// Outer switch: InfinityFree only lets us receive GET and POST, so we only
// handle those two real HTTP methods here.
switch ($_SERVER["REQUEST_METHOD"]) {
    case "GET":
        // GET /message?key=<session key> -> returns the message history for a session.
        $key = $_GET["key"] ?? null;

        if ($key == null || $key == "") {
            http_response_code(400);
            echo json_encode(["message" => "Missing 'key' query parameter."]);
            exit;
        }

        $sessionId = findSessionId($key);
        if ($sessionId == false) {
            http_response_code(404);
            echo json_encode(["message" => "Session not found."]);
            exit;
        }

        $messages = loadHistory($sessionId);
        echo json_encode(["key" => $key, "messages" => $messages]);
        exit;
    case "POST":
        // Inner switch: since PUT/DELETE are blocked by InfinityFree, the real
        // verb is tunneled through the `_method` field in the JSON body.
        switch ($data["_method"]) {
            case "POST":
                // POST /message with body { "key": ?, "content": "..." } -> sends a
                // message. If 'key' is omitted, a new session is created.
                $key = $data["key"] ?? null;
                $content = $data["content"] ?? null;

                if ($content == null || trim($content) == "") {
                    http_response_code(400);
                    echo json_encode(["message" => "Missing 'content' field."]);
                    exit;
                }

                // Resolve the session: reuse an existing one by key, or create a new one.
                if ($key == null || $key == "") {
                    $sessionId = createSession();
                    $key = $db->query("SELECT `key` FROM `sessions` WHERE `id` = {$sessionId}")->fetchArray()["key"];
                } else {
                    $sessionId = findSessionId($key);
                    if ($sessionId == false) {
                        http_response_code(404);
                        echo json_encode(["message" => "Session not found."]);
                        exit;
                    }
                }

                // Persist the user's message, then build the full history for the model.
                insertMessage($sessionId, "user", $content);
                $history = loadHistory($sessionId);
                array_unshift($history, [
                    "role" => "system",
                    "content" => file_get_contents("../assets/prompt.md")
                ]);

                $answer = askModel($history);
                if ($answer["ok"] == false) {
                    http_response_code(502);
                    echo json_encode(["message" => $answer["error"]]);
                    exit;
                }

                // The model may return a structured reply that also updates the
                // global textboard or times the user out. Parse it, apply any
                // board change, and return the current board so the frontend can
                // stay in sync.
                $parsed = parseResponse($answer["content"]);
                if ($parsed["board"] !== null) {
                    saveBoard($parsed["board"]);
                }

                // Persist the assistant's reply and return it to the client.
                insertMessage($sessionId, "assistant", $parsed["reply"]);
                echo json_encode([
                    "key" => $key,
                    "message" => $parsed["reply"],
                    "board" => loadBoard(),
                    "timeout" => $parsed["timeout"]
                ]);
                exit;
            case "PUT":
                // POST /message with _method "PUT" and body
                // { "key": ?, "index": N, "content": "..." } -> edits the
                // message at zero-based index N (0 = first/oldest message).
                $key = $data["key"] ?? null;
                $index = $data["index"] ?? null;
                $content = $data["content"] ?? null;

                if ($key == null || $key == "") {
                    http_response_code(400);
                    echo json_encode(["message" => "Missing 'key' field."]);
                    exit;
                }
                if (!is_int($index) || $index < 0) {
                    http_response_code(400);
                    echo json_encode(["message" => "Missing or invalid 'index' field."]);
                    exit;
                }
                if ($content == null || trim($content) == "") {
                    http_response_code(400);
                    echo json_encode(["message" => "Missing 'content' field."]);
                    exit;
                }

                $sessionId = findSessionId($key);
                if ($sessionId == false) {
                    http_response_code(404);
                    echo json_encode(["message" => "Session not found."]);
                    exit;
                }

                $messageIds = loadMessageIds($sessionId);
                if ($index >= count($messageIds)) {
                    http_response_code(404);
                    echo json_encode(["message" => "Message not found."]);
                    exit;
                }

                executePreparedQuery(
                    $db,
                    "UPDATE `messages` SET `content` = :content WHERE `id` = :id",
                    [":content" => $content, ":id" => $messageIds[$index]["id"]]
                );

                echo json_encode(["key" => $key, "messages" => loadHistory($sessionId)]);
                exit;
            case "DELETE":
                // POST /message with _method "DELETE" and body
                // { "key": ?, "index": N } -> deletes the message at
                // zero-based index N (0 = first/oldest message).
                $key = $data["key"] ?? null;
                $index = $data["index"] ?? null;

                if ($key == null || $key == "") {
                    http_response_code(400);
                    echo json_encode(["message" => "Missing 'key' field."]);
                    exit;
                }
                if (!is_int($index) || $index < 0) {
                    http_response_code(400);
                    echo json_encode(["message" => "Missing or invalid 'index' field."]);
                    exit;
                }

                $sessionId = findSessionId($key);
                if ($sessionId == false) {
                    http_response_code(404);
                    echo json_encode(["message" => "Session not found."]);
                    exit;
                }

                $messageIds = loadMessageIds($sessionId);
                if ($index >= count($messageIds)) {
                    http_response_code(404);
                    echo json_encode(["message" => "Message not found."]);
                    exit;
                }

                executePreparedQuery(
                    $db,
                    "DELETE FROM `messages` WHERE `id` = :id",
                    [":id" => $messageIds[$index]["id"]]
                );

                echo json_encode(["key" => $key, "messages" => loadHistory($sessionId)]);
                exit;
            default:
                http_response_code(422);
                echo json_encode(["message" => "Method not allowed."]);
                exit;
        }
    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed."]);
        exit;
}