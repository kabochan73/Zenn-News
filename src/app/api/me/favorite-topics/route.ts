import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { getTopicBySlug } from "@/lib/topics";

function unauthorizedResponse() {
  return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
}

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return unauthorizedResponse();
  }

  const [user] = await db
    .select({ favoriteTopics: users.favoriteTopics })
    .from(users)
    .where(eq(users.id, session.sub))
    .limit(1);

  return NextResponse.json({ favoriteTopics: user?.favoriteTopics ?? [] });
}

export async function PUT(request: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return unauthorizedResponse();
  }

  const body = await request.json().catch(() => null);
  const favoriteTopics = Array.isArray(body?.favoriteTopics)
    ? body.favoriteTopics
    : null;

  const isValid =
    favoriteTopics !== null &&
    favoriteTopics.length > 0 &&
    favoriteTopics.every(
      (slug: unknown) => typeof slug === "string" && getTopicBySlug(slug),
    );

  if (!isValid) {
    return NextResponse.json(
      { error: "トピックを1つ以上選んでください" },
      { status: 400 },
    );
  }

  await db
    .update(users)
    .set({ favoriteTopics })
    .where(eq(users.id, session.sub));

  return NextResponse.json({ favoriteTopics });
}
