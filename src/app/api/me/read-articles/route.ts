import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { readArticles } from "@/lib/schema";

function unauthorizedResponse() {
  return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
}

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return unauthorizedResponse();
  }

  const rows = await db
    .select({ articleId: readArticles.articleId })
    .from(readArticles)
    .where(eq(readArticles.userId, session.sub));

  return NextResponse.json({
    readArticleIds: rows.map((row) => row.articleId),
  });
}

export async function POST(request: Request) {
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
    .insert(readArticles)
    .values({ userId: session.sub, articleId })
    .onConflictDoNothing();

  return NextResponse.json({ ok: true }, { status: 201 });
}
