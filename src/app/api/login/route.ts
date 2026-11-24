import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  verifyPassword,
} from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";

function invalidCredentialsResponse() {
  return NextResponse.json(
    { error: "ユーザー名またはパスワードが違います" },
    { status: 401 },
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const username =
    typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!username || !password) {
    return invalidCredentialsResponse();
  }

  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      passwordHash: users.passwordHash,
    })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return invalidCredentialsResponse();
  }

  const token = await createSessionToken({
    sub: user.id,
    username: user.username,
  });

  const response = NextResponse.json({ username: user.username });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
