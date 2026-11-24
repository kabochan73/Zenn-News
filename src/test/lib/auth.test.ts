// @vitest-environment node
//
// jose は TextEncoder で Uint8Array の鍵を作る。jsdom 環境だと jsdom 提供の
// TextEncoder が別レルムの Uint8Array を返し、jose 内部の instanceof 判定に
// 失敗するため、DOM を使わないこのテストは Node 環境で実行する。
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createSessionToken,
  hashPassword,
  verifyPassword,
  verifySessionToken,
} from "@/lib/auth";

const ORIGINAL_SECRET = process.env.AUTH_SECRET;
const THIRTY_DAYS_MS = 60 * 60 * 24 * 30 * 1000;
const PAYLOAD = { sub: "user-1", username: "testuser" };

describe("hashPassword / verifyPassword", () => {
  it("ハッシュ化したパスワードは元の文字列と一致しない", async () => {
    const hash = await hashPassword("correct-password");
    expect(hash).not.toBe("correct-password");
  });

  it("正しいパスワードは true と判定される", async () => {
    const hash = await hashPassword("correct-password");
    expect(await verifyPassword("correct-password", hash)).toBe(true);
  });

  it("間違ったパスワードは false と判定される", async () => {
    const hash = await hashPassword("correct-password");
    expect(await verifyPassword("wrong-password", hash)).toBe(false);
  });
});

describe("createSessionToken / verifySessionToken", () => {
  beforeEach(() => {
    process.env.AUTH_SECRET = "test-secret-key-for-vitest";
  });

  afterEach(() => {
    process.env.AUTH_SECRET = ORIGINAL_SECRET;
    vi.useRealTimers();
  });

  it("発行したトークンを検証すると、ペイロードが取得できる", async () => {
    const token = await createSessionToken(PAYLOAD);
    expect(await verifySessionToken(token)).toEqual(PAYLOAD);
  });

  it("改ざんされたトークンは false になる", async () => {
    const token = await createSessionToken(PAYLOAD);
    const tampered = `${token.slice(0, -1)}${token.endsWith("a") ? "b" : "a"}`;
    expect(await verifySessionToken(tampered)).toBe(false);
  });

  it("発行時と異なる秘密鍵では検証に失敗する", async () => {
    const token = await createSessionToken(PAYLOAD);

    process.env.AUTH_SECRET = "different-secret";
    expect(await verifySessionToken(token)).toBe(false);
  });

  it("30日経過すると期限切れで false になる", async () => {
    vi.useFakeTimers();
    const token = await createSessionToken(PAYLOAD);

    vi.advanceTimersByTime(THIRTY_DAYS_MS + 60_000);

    expect(await verifySessionToken(token)).toBe(false);
  });

  it("JWT の形をしていない文字列は false になる", async () => {
    expect(await verifySessionToken("not-a-jwt")).toBe(false);
  });

  it("AUTH_SECRET が未設定だとトークンの発行に失敗する", async () => {
    delete process.env.AUTH_SECRET;
    await expect(createSessionToken(PAYLOAD)).rejects.toThrow(
      "AUTH_SECRET が設定されていません",
    );
  });
});
