import Database from "better-sqlite3";
import { app } from "electron";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

let instance: Database.Database | null = null;

export function initializeAuthStore() {
  getAuthDatabase();
}

export function getAuthDatabase() {
  if (instance) {
    return instance;
  }

  if (!app.isReady()) {
    throw new Error(
      "Application must be ready before creating the auth store."
    );
  }

  const directory = app.getPath("userData");
  const dbPath = path.join(directory, "local-auth.db");

  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
  }

  instance = new Database(dbPath);
  instance.pragma("journal_mode = WAL");
  instance.pragma("synchronous = NORMAL");

  createSchema(instance);

  return instance;
}

function createSchema(db: Database.Database) {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();

  db.prepare(
    `CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      user_id INTEGER,
      established_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
    )`
  ).run();

  db.prepare(
    `INSERT INTO sessions (id, user_id, established_at)
     VALUES (1, NULL, NULL)
     ON CONFLICT(id) DO NOTHING`
  ).run();
}
