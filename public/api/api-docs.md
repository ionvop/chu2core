# Chat API Documentation

A lightweight chat-completion API backed by SQLite and [OpenRouter](https://openrouter.ai). It persists conversation history per session and streams a single assistant reply per request.

## Base URL

```
https://<your-domain>/api
```

All endpoints return JSON with `Content-Type: application/json`.

---

## Hosting Constraints (InfinityFree)

This API is designed to run on **InfinityFree**, which imposes two hard limits that shape the API design:

1. **Same-origin only** — No CORS headers are sent. The frontend must be served from the **same host/domain** as this API.
2. **Only `GET` and `POST` are allowed** — `PUT`, `PATCH`, and `DELETE` are rejected by the server. To still support full CRUD, the real HTTP verb is **tunneled** through a `_method` field in the JSON body.

> **Method tunneling:** For any non-GET operation, send a `POST` request with a JSON body that includes `"_method": "PUT"` (or `"DELETE"`). The server dispatches on that value.

> **Message indexing:** When editing or deleting messages, each message is addressed by a zero-based `index` relative to the full session history as returned by `GET /api/chat`. `index` `0` is the **first (oldest)** message and `messages.length - 1` is the **latest**. The index is resolved against the current history each request, so it may shift after other edits or deletions.

---

## Endpoints

### `GET /api/` — Health check

Returns a simple greeting to confirm the API is reachable.

**Response `200 OK`**

```json
{
  "message": "Hello, world!"
}
```

---

### `GET /api/chat?key=<session_key>` — Get message history

Returns the full message history for an existing session, oldest first.

**Query parameters**

| Parameter | Type   | Required | Description                          |
|-----------|--------|----------|--------------------------------------|
| `key`     | string | Yes      | The unique session key.              |

**Responses**

`200 OK` — History retrieved.

```json
{
  "key": "session_abc123",
  "messages": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi there!" }
  ]
}
```

| Status | Condition                                  |
|--------|--------------------------------------------|
| `400`  | `key` query parameter is missing or empty. |
| `404`  | No session exists with the given `key`.    |

Error body:

```json
{ "message": "Session not found." }
```

---

### `POST /api/chat` — Send a message

Sends a user message to the model and returns the assistant's reply. If `key` is omitted, a **new session is created** and its key is returned.

**Request body** (`application/json`)

| Field     | Type   | Required | Description                                        |
|-----------|--------|----------|----------------------------------------------------|
| `key`     | string | No       | Existing session key. Omit to create a new session.|
| `content` | string | Yes      | The user's message text.                           |

**Example — new session**

```json
{
  "content": "What is the capital of France?"
}
```

**Example — continuing a session**

```json
{
  "key": "session_abc123",
  "content": "And what about Spain?"
}
```

**Responses**

`200 OK` — Message processed and assistant reply persisted.

```json
{
  "key": "session_abc123",
  "message": "The capital of France is Paris.",
  "board": "Welcome to the global textboard!"
}
```

The `board` field is the current global textboard content. It is included on every reply so the frontend can stay in sync; the AI updates it whenever a user asks it to write to the board.

| Status | Condition                                                                 |
|--------|---------------------------------------------------------------------------|
| `400`  | `content` field is missing or empty.                                     |
| `404`  | The provided `key` does not match any existing session.                  |
| `502`  | The upstream OpenRouter request failed (see `message` for the reason).   |

---

### `POST /api/chat` with `_method: "PUT"` — Edit a message

Edits the content of an existing message, addressed by its zero-based index in the session history.

**Request body** (`application/json`)

| Field     | Type   | Required | Description                                                                 |
|-----------|--------|----------|-----------------------------------------------------------------------------|
| `_method` | string | Yes      | Must be `"PUT"`.                                                            |
| `key`     | string | Yes      | The session key containing the message.                                     |
| `index`   | int    | Yes      | Zero-based message index. `0` = first (oldest) message.                     |
| `content` | string | Yes      | The new message text.                                                       |

**Example**

```json
{
  "_method": "PUT",
  "key": "session_abc123",
  "index": 1,
  "content": "Edited question."
}
```

**Responses**

`200 OK` — Message updated. Returns the updated full history.

```json
{
  "key": "session_abc123",
  "messages": [
    { "role": "user", "content": "Hello" },
    { "role": "user", "content": "Edited question." }
  ]
}
```

| Status | Condition                                             |
|--------|-------------------------------------------------------|
| `400`  | `key`, `index` or `content` is missing or invalid.    |
| `404`  | Session not found, or `index` is out of range.        |

---

### `POST /api/chat` with `_method: "DELETE"` — Delete a message

Deletes an existing message from a session, addressed by its zero-based index in the session history.

**Request body** (`application/json`)

| Field     | Type   | Required | Description                                                                 |
|-----------|--------|----------|-----------------------------------------------------------------------------|
| `_method` | string | Yes      | Must be `"DELETE"`.                                                         |
| `key`     | string | Yes      | The session key containing the message.                                     |
| `index`   | int    | Yes      | Zero-based message index. `0` = first (oldest) message.                     |

**Example**

```json
{
  "_method": "DELETE",
  "key": "session_abc123",
  "index": 1
}
```

**Responses**

`200 OK` — Message deleted. Returns the updated full history.

```json
{
  "key": "session_abc123",
  "messages": [
    { "role": "user", "content": "Hello" }
  ]
}
```

| Status | Condition                                             |
|--------|-------------------------------------------------------|
| `400`  | `key` or `index` is missing or invalid.               |
| `404`  | Session not found, or `index` is out of range.        |

---

### `GET /api/board` — Read the global textboard

Returns the single global textboard blob shared by every visitor. This is a read-only endpoint for the frontend; all writes go through the AI via the chat endpoint.

**Responses**

`200 OK` — Board content retrieved.

```json
{
  "content": "Welcome to the global textboard!"
}
```

---

### `POST /api/board` — Replace the global textboard

Replaces the entire global textboard content. Intended for server-side/AI use; the frontend normally reads the board and lets the AI write to it.

**Request body** (`application/json`)

| Field     | Type   | Required | Description                          |
|-----------|--------|----------|--------------------------------------|
| `_method` | string | Yes      | Must be `"POST"`.                    |
| `content` | string | Yes      | The full new board content.          |

**Example**

```json
{
  "_method": "POST",
  "content": "New board content."
}
```

**Responses**

`200 OK` — Board replaced. Returns the updated content.

```json
{
  "content": "New board content."
}
```

| Status | Condition                          |
|--------|------------------------------------|
| `400`  | `content` field is missing.        |

---

### Unsupported methods

Any request that is not `GET`, or a `POST` without a recognized `_method`, returns:

| Status | Condition                                                       |
|--------|-----------------------------------------------------------------|
| `405`  | Real HTTP method is not `GET` or `POST`.                        |
| `422`  | `POST` body has an unrecognized `_method` value.                |

```json
{ "message": "Method not allowed." }
```

---

## Data Model

SQLite database (`database.db`) with two tables:

**`sessions`**

| Column      | Type    | Notes                          |
|-------------|---------|--------------------------------|
| `id`        | INTEGER | Primary key, auto-increment.   |
| `key`       | TEXT    | Unique session key.            |
| `created_at`| TEXT    | Defaults to current datetime.  |

**`messages`**

| Column      | Type    | Notes                                        |
|-------------|---------|----------------------------------------------|
| `id`        | INTEGER | Primary key, auto-increment.                 |
| `session_id`| INTEGER | Foreign key → `sessions.id`.                 |
| `role`      | TEXT    | `user` or `assistant`.                       |
| `content`   | TEXT    | Message text.                                |
| `created_at`| TEXT    | Defaults to current datetime.                |

**`textboard`**

| Column      | Type    | Notes                                        |
|-------------|---------|----------------------------------------------|
| `id`        | INTEGER | Primary key, auto-increment.                 |
| `content`   | TEXT    | The single global textboard blob.            |
| `updated_at`| TEXT    | Defaults to current datetime.                |

The `textboard` table holds exactly one row (seeded on init) representing the global board shared by all visitors.

---

## Configuration

Set your OpenRouter API key in `config.php`:

```php
$OPENROUTER_API_KEY = "sk-or-v1-...";
```

The model used for completions is defined in `chat/index.php`:

```php
$MODEL = "deepseek/deepseek-v4-flash-0731";
```

The system prompt is loaded from `assets/prompt.md` and prepended to every conversation before it is sent to the model.

---

## Notes & Limitations

- **No streaming** — Each request waits for the full assistant reply before responding (up to a 120-second upstream timeout).
- **Single reply per request** — The API returns one assistant message per call; it does not maintain a persistent connection.
- **Same-origin only** — Deploy the frontend on the same domain as this API.
- **SSL verification is disabled** in the upstream `fetch()` helper (`CURLOPT_SSL_VERIFYPEER = false`), which is acceptable for development but not recommended for production.