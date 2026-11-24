import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { bookmarks } from "@/lib/schema";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const rows = await db
    .select({
      articleId: bookmarks.articleId,
      path: bookmarks.path,
      title: bookmarks.title,
      authorName: bookmarks.authorName,
      authorAvatarUrl: bookmarks.authorAvatarUrl,
      publishedAt: bookmarks.publishedAt,
      bookmarkedAt: bookmarks.bookmarkedAt,
    })
    .from(bookmarks)
    .where(eq(bookmarks.userId, session.sub))
    .orderBy(desc(bookmarks.bookmarkedAt));

  return NextResponse.json({ bookmarks: rows });
}
