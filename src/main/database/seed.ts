import { getDb, schema } from "./index";

export function seed() {
  const db = getDb();

  // Ensure singleton session row exists
  db.insert(schema.sessions)
    .values({ id: 1, userId: null, establishedAt: null })
    .onConflictDoNothing()
    .run();
}
