import { bigint, pgTable, varchar } from "drizzle-orm/pg-core";

export const participants = pgTable("participants", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  soketiUserId: varchar({ length: 100 }),
  quizId: bigint({ mode: "number" })
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
  displayName: varchar({ length: 255 }).notNull().unique(),
  avatar: varchar({ length: 255 }),
});

export const quizzes = pgTable("quizzes", {
  id: bigint({ mode: "number" }).primaryKey(),
});
