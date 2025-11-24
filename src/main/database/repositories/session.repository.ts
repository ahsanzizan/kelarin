import { eq, sql } from "drizzle-orm";
import { DatabaseError } from "shared/errors";
import { getDb, schema } from "../index";
import type { Session } from "../schema/";

const SESSION_ID = 1;

export class SessionRepository {
  private readonly db = getDb();

  async get(): Promise<Session | null> {
    try {
      const result = await this.db
        .select()
        .from(schema.sessions)
        .where(eq(schema.sessions.id, SESSION_ID))
        .limit(1);

      return result[0] ?? null;
    } catch (error) {
      throw new DatabaseError("Failed to fetch session", { cause: error });
    }
  }

  async setUser(userId: number): Promise<Session | null> {
    try {
      const result = await this.db
        .update(schema.sessions)
        .set({
          userId,
          establishedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(schema.sessions.id, SESSION_ID))
        .returning();

      return result[0] ?? null;
    } catch (error) {
      throw new DatabaseError("Failed to set session user", { cause: error });
    }
  }

  async clear(): Promise<Session | null> {
    try {
      const result = await this.db
        .update(schema.sessions)
        .set({
          userId: null,
          establishedAt: null,
        })
        .where(eq(schema.sessions.id, SESSION_ID))
        .returning();

      return result[0] ?? null;
    } catch (error) {
      throw new DatabaseError("Failed to clear session", { cause: error });
    }
  }
}
