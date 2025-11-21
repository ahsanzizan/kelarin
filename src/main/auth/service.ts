import bcrypt from "bcryptjs";

import { getAuthDatabase } from "./database";
import { CredentialsPayload, LocalUser, SessionSnapshot } from "shared/types";

const BCRYPT_ROUNDS = 12;

type UserRow = {
  id: number;
  username: string;
  created_at: string;
};

export function getCurrentSession(): SessionSnapshot {
  const db = getAuthDatabase();
  const sessionRow = db
    .prepare<{ id: number }, { user_id: number | null }>(
      "SELECT user_id FROM sessions WHERE id = 1"
    )
    .get({ id: 1 });

  if (!sessionRow?.user_id) {
    return { isAuthenticated: false, user: null };
  }

  const user = db
    .prepare<{ id: number }, UserRow>(
      "SELECT id, username, created_at FROM users WHERE id = @id"
    )
    .get({ id: sessionRow.user_id });

  if (!user) {
    clearSession();
    return { isAuthenticated: false, user: null };
  }

  return { isAuthenticated: true, user: mapUser(user) };
}

export function registerLocalAccount(payload: CredentialsPayload) {
  const { username, password } = sanitizeCredentials(payload);
  const db = getAuthDatabase();

  const existingUser = db
    .prepare<{ username: string }, UserRow>(
      "SELECT id, username, created_at FROM users WHERE username = @username"
    )
    .get({ username });

  if (existingUser) {
    throw new Error("That username is already taken.");
  }

  const passwordHash = bcrypt.hashSync(password, BCRYPT_ROUNDS);

  const insert = db.prepare(
    `INSERT INTO users (username, password_hash) VALUES (@username, @passwordHash)`
  );

  const result = insert.run({ username, passwordHash });

  db.prepare(
    `UPDATE sessions
     SET user_id = @userId, established_at = CURRENT_TIMESTAMP
     WHERE id = 1`
  ).run({ userId: Number(result.lastInsertRowid) });

  return getCurrentSession();
}

export function loginLocalAccount(payload: CredentialsPayload) {
  const { username, password } = sanitizeCredentials(payload);
  const db = getAuthDatabase();

  const user = db
    .prepare<{ username: string }, UserRow & { password_hash: string }>(
      "SELECT id, username, created_at, password_hash FROM users WHERE username = @username"
    )
    .get({ username });

  if (!user) {
    throw new Error("We couldn't find an account with that username.");
  }

  const isValidPassword = bcrypt.compareSync(password, user.password_hash);

  if (!isValidPassword) {
    throw new Error("Incorrect password.");
  }

  db.prepare(
    `UPDATE sessions
     SET user_id = @userId, established_at = CURRENT_TIMESTAMP
     WHERE id = 1`
  ).run({ userId: user.id });

  return getCurrentSession();
}

export function logoutLocalAccount(): SessionSnapshot {
  clearSession();
  return { isAuthenticated: false, user: null };
}

function sanitizeCredentials(payload: CredentialsPayload): CredentialsPayload {
  const username = payload.username.trim();
  const password = payload.password.trim();

  if (username.length < 3 || username.length > 48) {
    throw new Error("Usernames must be between 3 and 48 characters.");
  }

  if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
    throw new Error(
      "Usernames can only include letters, numbers, dots, underscores, or hyphens."
    );
  }

  if (password.length < 8) {
    throw new Error("Passwords must be at least 8 characters long.");
  }

  return { username, password };
}

function mapUser(row: UserRow): LocalUser {
  return {
    id: row.id,
    username: row.username,
    createdAt: row.created_at,
  };
}

function clearSession() {
  const db = getAuthDatabase();

  db.prepare(
    `UPDATE sessions
     SET user_id = NULL, established_at = NULL
     WHERE id = 1`
  ).run();
}
