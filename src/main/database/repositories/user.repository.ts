import { and, eq, sql } from "drizzle-orm";
import { ConflictError, DatabaseError } from "shared/errors";
import { getDb, schema } from "../index";
import type { NewUser, User } from "../schema/";

export class UserRepository {
  private readonly db = getDb();

  async findById(id: number): Promise<User | null> {
    try {
      const result = await this.db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, id))
        .limit(1);

      return result[0] ?? null;
    } catch (error) {
      throw new DatabaseError(`Failed to find user ${id}`, { cause: error });
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      const result = await this.db
        .select()
        .from(schema.users)
        .where(eq(schema.users.username, username))
        .limit(1);

      return result[0] ?? null;
    } catch (error) {
      throw new DatabaseError(`Failed to find user by username`, {
        cause: error,
      });
    }
  }

  async usernameExists(username: string): Promise<boolean> {
    try {
      const result = await this.db
        .select({ count: sql<number>`count(*)` })
        .from(schema.users)
        .where(eq(schema.users.username, username));

      return (result[0]?.count ?? 0) > 0;
    } catch (error) {
      throw new DatabaseError("Failed to check if username exists", {
        cause: error,
      });
    }
  }

  async create(data: NewUser): Promise<User> {
    try {
      // Check for existing username/email before creating
      if (data.username) {
        const usernameExists = await this.usernameExists(data.username);
        if (usernameExists) {
          throw new ConflictError("Username already exists");
        }
      }

      const result = await this.db
        .insert(schema.users)
        .values(data)
        .returning();

      if (!result[0]) {
        throw new Error("Failed to create user");
      }

      return result[0];
    } catch (error) {
      if (error instanceof ConflictError) {
        throw error;
      }
      throw new DatabaseError("Failed to create user", { cause: error });
    }
  }

  async update(id: number, data: Partial<NewUser>): Promise<User | null> {
    try {
      // If updating username/email, check for conflicts
      if (data.username) {
        const existingUser = await this.db
          .select()
          .from(schema.users)
          .where(
            and(
              eq(schema.users.username, data.username),
              sql`${schema.users.id} != ${id}`
            )
          )
          .limit(1);

        if (existingUser[0]) {
          throw new ConflictError("Username already exists");
        }
      }

      const result = await this.db
        .update(schema.users)
        .set(data)
        .where(eq(schema.users.id, id))
        .returning();

      return result[0] ?? null;
    } catch (error) {
      if (error instanceof ConflictError) {
        throw error;
      }
      throw new DatabaseError(`Failed to update user ${id}`, { cause: error });
    }
  }

  async updatePassword(id: number, hashedPassword: string): Promise<boolean> {
    try {
      const result = await this.db
        .update(schema.users)
        .set({
          passwordHash: hashedPassword,
        })
        .where(eq(schema.users.id, id))
        .returning();

      return result.length > 0;
    } catch (error) {
      throw new DatabaseError(`Failed to update password for user ${id}`, {
        cause: error,
      });
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.db
        .delete(schema.users)
        .where(eq(schema.users.id, id))
        .returning();

      return result.length > 0;
    } catch (error) {
      throw new DatabaseError(`Failed to delete user ${id}`, { cause: error });
    }
  }
}
