import "server-only";
import { compare, hash } from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "zenn_news_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const BCRYPT_SALT_ROUNDS = 10;
const SESSION_DURATION = "30d";

function getSecretKey() {
  if (!process.env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET が設定されていません");
  }
  return new TextEncoder().encode(process.env.AUTH_SECRET);
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, BCRYPT_SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return compare(password, passwordHash);
}

export type SessionPayload = {
  sub: string;
  username: string;
};

export async function createSessionToken(
  payload: SessionPayload,
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | false> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (
      typeof payload.sub !== "string" ||
      typeof payload.username !== "string"
    ) {
      return false;
    }
    return { sub: payload.sub, username: payload.username };
  } catch {
    return false;
  }
}

export async function getCurrentSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }
  const session = await verifySessionToken(token);
  return session || null;
}
