import { eq } from 'drizzle-orm'
import { getDb, schema } from '../index'
import type { NewUser, User } from '../schema/'

export const userRepository = {
  findById(id: number): User | undefined {
    return getDb()
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .get()
  },

  findByUsername(username: string): User | undefined {
    return getDb()
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, username))
      .get()
  },

  create(data: NewUser): User {
    return getDb().insert(schema.users).values(data).returning().get()
  },

  delete(id: number): void {
    getDb().delete(schema.users).where(eq(schema.users.id, id)).run()
  },
}
