import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { bookmarks } from "@/lib/schema";

const BOOKMARK_LIMIT = 100;

function unauthorizedResponse() {
  return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
}

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return unauthorizedResponse();
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

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return unauthorizedResponse();
  }

  const body = await request.json().catch(() => null);
  const articleId = Number(body?.articleId);
  const path = typeof body?.path === "string" ? body.path : "";
  const title = typeof body?.title === "string" ? body.title : "";
  const authorName =
    typeof body?.authorName === "string" ? body.authorName : "";
  const authorAvatarUrl =
    typeof body?.authorAvatarUrl === "string" ? body.authorAvatarUrl : null;
  const publishedAt =
    typeof body?.publishedAt === "string" ? body.publishedAt : "";

  if (
    !Number.isInteger(articleId) ||
    !path ||
    !title ||
    !authorName ||
    !publishedAt
  ) {
    return NextResponse.json({ error: "記事情報が不正です" }, { status: 400 });
  }

  const existingRows = await db
    .select({ articleId: bookmarks.articleId })
    .from(bookmarks)
    .where(eq(bookmarks.userId, session.sub));

  const alreadyBookmarked = existingRows.some(
    (row) => row.articleId === articleId,
  );

  if (!alreadyBookmarked && existingRows.length >= BOOKMARK_LIMIT) {
    return NextResponse.json(
      {
        error: `ブックマークは${BOOKMARK_LIMIT}件までです。いくつか外してください`,
      },
      { status: 400 },
    );
  }

  await db
    .insert(bookmarks)
    .values({
      userId: session.sub,
      articleId,
      path,
      title,
      authorName,
      authorAvatarUrl,
      publishedAt: new Date(publishedAt),
    })
    .onConflictDoNothing();

  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return unauthorizedResponse();
  }

  const body = await request.json().catch(() => null);
  const articleId = Number(body?.articleId);

  if (!Number.isInteger(articleId)) {
    return NextResponse.json({ error: "articleIdが不正です" }, { status: 400 });
  }

  await db
    .delete(bookmarks)
    .where(
      and(
        eq(bookmarks.userId, session.sub),
        eq(bookmarks.articleId, articleId),
      ),
    );

  return NextResponse.json({ ok: true });
}
