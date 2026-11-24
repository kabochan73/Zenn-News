CREATE TABLE "bookmarks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"article_id" integer NOT NULL,
	"path" text NOT NULL,
	"title" text NOT NULL,
	"author_name" text NOT NULL,
	"author_avatar_url" text,
	"published_at" timestamp NOT NULL,
	"bookmarked_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bookmarks_user_id_article_id_unique" UNIQUE("user_id","article_id")
);
--> statement-breakpoint
CREATE TABLE "read_articles" (
	"user_id" uuid NOT NULL,
	"article_id" integer NOT NULL,
	"read_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "read_articles_user_id_article_id_pk" PRIMARY KEY("user_id","article_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	"favorite_topics" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "read_articles" ADD CONSTRAINT "read_articles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;