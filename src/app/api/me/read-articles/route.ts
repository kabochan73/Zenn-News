import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { readArticles } from "@/lib/schema";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const rows = await db
    .select({ articleId: readArticles.articleId })
    .from(readArticles)
    .where(eq(readArticles.userId, session.sub));

  return NextResponse.json({
    readArticleIds: rows.map((row) => row.articleId),
  });
}
