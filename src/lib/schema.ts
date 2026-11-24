import {
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  favoriteTopics: jsonb("favorite_topics")
    .$type<string[]>()
    .notNull()
    .default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const bookmarks = pgTable(
  "bookmarks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    articleId: integer("article_id").notNull(),
    path: text("path").notNull(),
    title: text("title").notNull(),
    authorName: text("author_name").notNull(),
    authorAvatarUrl: text("author_avatar_url"),
    publishedAt: timestamp("published_at").notNull(),
    bookmarkedAt: timestamp("bookmarked_at").notNull().defaultNow(),
  },
  (table) => [unique().on(table.userId, table.articleId)],
);

export const readArticles = pgTable(
  "read_articles",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    articleId: integer("article_id").notNull(),
    readAt: timestamp("read_at").notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.articleId] })],
);
