import { and, eq } from "drizzle-orm";
import { DatabaseError } from "shared/errors";
import { getDb, schema } from "../index";
import { Task } from "../schema";
import type { Board, NewBoard } from "../schema/board.schema";

export type BoardWithTasks = Board & {
  tasks: Task[];
};

export class BoardRepository {
  private readonly db = getDb();

  async findById(id: number): Promise<Board | null> {
    try {
      const result = await this.db
        .select()
        .from(schema.boards)
        .where(eq(schema.boards.id, id))
        .limit(1);

      return result[0] ?? null;
    } catch (error) {
      throw new DatabaseError(`Failed to find board ${id}`, { cause: error });
    }
  }

  async findByIdAndUser(id: number, userId: number): Promise<Board | null> {
    try {
      const result = await this.db
        .select()
        .from(schema.boards)
        .where(and(eq(schema.boards.id, id), eq(schema.boards.user, userId)))
        .limit(1);

      return result[0] ?? null;
    } catch (error) {
      throw new DatabaseError(`Failed to find board ${id} for user ${userId}`, {
        cause: error,
      });
    }
  }

  async findAllByUser(
    userId: number,
    includeArchived = false
  ): Promise<Board[]> {
    try {
      const conditions = [eq(schema.boards.user, userId)];

      if (!includeArchived) {
        conditions.push(eq(schema.boards.isArchived, false));
      }

      return await this.db
        .select()
        .from(schema.boards)
        .where(and(...conditions))
        .orderBy(schema.boards.createdAt);
    } catch (error) {
      throw new DatabaseError(`Failed to fetch boards for user ${userId}`, {
        cause: error,
      });
    }
  }

  async create(data: NewBoard): Promise<Board> {
    try {
      const result = await this.db
        .insert(schema.boards)
        .values(data)
        .returning();

      if (!result[0]) {
        throw new Error("Failed to create board");
      }

      return result[0];
    } catch (error) {
      throw new DatabaseError("Failed to create board", { cause: error });
    }
  }

  async update(id: number, data: Partial<NewBoard>): Promise<Board | null> {
    try {
      const result = await this.db
        .update(schema.boards)
        .set(data)
        .where(eq(schema.boards.id, id))
        .returning();

      return result[0] ?? null;
    } catch (error) {
      throw new DatabaseError(`Failed to update board ${id}`, { cause: error });
    }
  }

  async archive(id: number, userId: number): Promise<boolean> {
    try {
      const result = await this.db
        .update(schema.boards)
        .set({ isArchived: true })
        .where(and(eq(schema.boards.id, id), eq(schema.boards.user, userId)))
        .returning();

      return result.length > 0;
    } catch (error) {
      throw new DatabaseError(`Failed to archive board ${id}`, {
        cause: error,
      });
    }
  }

  async delete(id: number, userId: number): Promise<boolean> {
    try {
      const result = await this.db
        .delete(schema.boards)
        .where(and(eq(schema.boards.id, id), eq(schema.boards.user, userId)))
        .returning();

      return result.length > 0;
    } catch (error) {
      throw new DatabaseError(`Failed to delete board ${id}`, { cause: error });
    }
  }

  async findByIdWithTasks(
    id: number,
    userId: number
  ): Promise<BoardWithTasks | null> {
    try {
      const result = await this.db.query.boards.findFirst({
        where: and(eq(schema.boards.id, id), eq(schema.boards.user, userId)),
        with: {
          tasks: {
            orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
          },
        },
      });

      return result ?? null;
    } catch (error) {
      throw new DatabaseError(`Failed to find board ${id} with tasks`, {
        cause: error,
      });
    }
  }

  async findAllByUserWithTasks(
    userId: number,
    includeArchived = false,
    tasksPerBoard = 3
  ): Promise<BoardWithTasks[]> {
    try {
      const conditions = [eq(schema.boards.user, userId)];

      if (!includeArchived) {
        conditions.push(eq(schema.boards.isArchived, false));
      }

      return await this.db.query.boards.findMany({
        where: and(...conditions),
        with: {
          tasks: {
            limit: tasksPerBoard,
            orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
          },
        },
        orderBy: (boards, { desc }) => [desc(boards.createdAt)],
      });
    } catch (error) {
      throw new DatabaseError(
        `Failed to fetch boards with tasks for user ${userId}`,
        { cause: error }
      );
    }
  }
}
