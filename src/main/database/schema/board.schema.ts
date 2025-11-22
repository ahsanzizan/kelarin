import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const boards = sqliteTable('boards', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').default('').notNull(),
  isArchived: integer('is_archived', { mode: 'boolean' })
    .default(false)
    .notNull(),
  color: text('color').notNull().default('#fff'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
})

export type Board = typeof boards.$inferSelect
export type NewBoard = typeof boards.$inferInsert
