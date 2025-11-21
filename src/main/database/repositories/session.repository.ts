import { eq, sql } from "drizzle-orm";
import { getDb, schema } from "../index";
import type { Session } from "../schema/";

const SESSION_ID = 1;

export const sessionRepository = {
  get(): Session | undefined {
    return getDb()
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.id, SESSION_ID))
      .get();
  },

  setUser(userId: number): void {
    getDb()
      .update(schema.sessions)
      .set({
        userId,
        establishedAt: sql`CURRENT_TIMESTAMP`,
      })
      .where(eq(schema.sessions.id, SESSION_ID))
      .run();
  },

  clear(): void {
    getDb()
      .update(schema.sessions)
      .set({ userId: null, establishedAt: null })
      .where(eq(schema.sessions.id, SESSION_ID))
      .run();
  },
};
