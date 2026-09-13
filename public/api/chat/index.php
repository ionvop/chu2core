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
 * Sends the conversation to OpenRouter and returns the assistant reply.
 *
 * @param array $history The full message history (system prompt already included).
 * @return array An associative array with 'ok' (bool) and either 'content' or 'error'.
 */
function askModel(array $history): array {
    global $OPENROUTER_API_KEY, $MODEL;
    $response = fetch("https://openrouter.ai/api/v1/chat/completions", [
        "method" => "POST",
        "headers" => [
            "Content-Type" => "application/json",
            "Authorization" => "Bearer {$OPENROUTER_API_KEY}"
        ],
        "body" => [
            "model" => $MODEL,
            "messages" => $history
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

// Outer switch: InfinityFree only lets us receive GET and POST, so we only
// handle those two real HTTP methods here.
switch ($_SERVER["REQUEST_METHOD"]) {
    case "GET":
        // GET /chat?key=<session key> -> returns the message history for a session.
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
                // POST /chat with body { "key": ?, "content": "..." } -> sends a
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

                // Persist the assistant's reply and return it to the client.
                insertMessage($sessionId, "assistant", $answer["content"]);
                echo json_encode(["key" => $key, "message" => $answer["content"]]);
                exit;
            case "PUT":
                //
                exit;
            case "DELETE":
                //
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