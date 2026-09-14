CREATE TABLE `sessions` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `key` TEXT UNIQUE, `created_at` TEXT DEFAULT (datetime()));
CREATE TABLE "messages" (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `session_id` INTEGER REFERENCES `sessions`(`id`), `role` TEXT, `content` TEXT, `created_at` TEXT DEFAULT (datetime()));
CREATE TABLE "textboard" (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `content` TEXT, `updated_at` TEXT DEFAULT (datetime()));
