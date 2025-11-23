import { eq } from 'drizzle-orm'
import { getDb, schema } from '../index'
import type { Board, NewBoard } from '../schema/board.schema'

export const boardRepository = {
  findById(id: number): Board | undefined {
    return getDb()
      .select()
      .from(schema.boards)
      .where(eq(schema.boards.id, id))
      .get()
  },

  findAll(userId: number): Board[] {
    return getDb()
      .select()
      .from(schema.boards)
      .where(eq(schema.boards.user, userId))
      .all()
  },

  create(data: NewBoard): Board {
    return getDb().insert(schema.boards).values(data).returning().get()
  },

  delete(id: number): void {
    getDb().delete(schema.boards).where(eq(schema.boards.id, id)).run()
  },
}
