import { sql } from 'drizzle-orm'
import { check, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { users } from './user.schema'

export const sessions = sqliteTable(
  'sessions',
  {
    id: integer('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    establishedAt: text('established_at'),
  },
  table => [check('session_singleton', sql`${table.id} = 1`)]
)

export type Session = typeof sessions.$inferSelect
