import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";

// Define the 'users' table.
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(), // Firebase Auth UID or generated UID
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"), // Securely stored salted password hash
  role: text("role").notNull().default("parent"), // 'parent' or 'admin'
  createdAt: timestamp("created_at").defaultNow(),
});

// Define the 'students' table with a foreign key to 'users'.
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  name: text("name").notNull(),
  avatar: text("avatar").notNull(),
  progress: jsonb("progress").notNull(), // Stores nested StudentProgress object
  createdAt: timestamp("created_at").defaultNow(),
});

// Define relationships for the 'users' table.
export const usersRelations = relations(users, ({ many }) => ({
  students: many(students),
}));

// Define relationships for the 'students' table.
export const studentsRelations = relations(students, ({ one }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
}));
