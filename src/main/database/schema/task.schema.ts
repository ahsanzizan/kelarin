import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { boards } from "./board.schema";

export const stateEnum = ["backlog", "this week", "today", "done"] as const;
export type State = (typeof stateEnum)[number];

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  notes: text("notes").default("").notNull(),
  state: text("state", { enum: stateEnum }).default("backlog").notNull(),
  estimatedDuration: integer("estimated_duration").default(0).notNull(),
  durationTaken: integer("duration_taken").default(0).notNull(),
  finishedAt: text("finished_at"),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),

  board: integer("board").references(() => boards.id, { onDelete: "cascade" }),
});

export const tasksRelations = relations(tasks, ({ one }) => ({
  board: one(boards, {
    fields: [tasks.board],
    references: [boards.id],
  }),
}));

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
