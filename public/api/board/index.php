<?php

/**
 * Global textboard endpoint.
 *
 * The textboard is a SINGLE global text blob shared by every visitor. It is
 * meant to be read directly by the frontend, while all writes are performed by
 * the AI (CHU²) acting as an intermediary between users and the board.
 *
 * InfinityFree constraints (same as the message endpoint):
 *   - Same-origin only (no CORS headers).
 *   - Only GET and POST are allowed; the real verb is tunneled through the
 *     `_method` field in the JSON body.
 *
 * Endpoints:
 *   GET  /api/board            -> { "content": "<blob>" }
 *   POST /api/board            -> { "content": "<blob>" }  (upsert)
 *        body: { "_method": "POST", "content": "..." }
 */

require_once "../common.php";
header("Content-Type: application/json");
$data = json_decode(file_get_contents("php://input"), true);

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

switch ($_SERVER["REQUEST_METHOD"]) {
    case "GET":
        // GET /board -> returns the current global board content.
        echo json_encode(["content" => loadBoard()]);
        exit;
    case "POST":
        // Inner switch: the real verb is tunneled through `_method`.
        switch ($data["_method"]) {
            case "POST":
                // POST /board with body { "content": "..." } -> replaces the
                // global board content.
                $content = $data["content"] ?? null;

                if ($content == null) {
                    http_response_code(400);
                    echo json_encode(["message" => "Missing 'content' field."]);
                    exit;
                }

                saveBoard($content);
                echo json_encode(["content" => loadBoard()]);
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