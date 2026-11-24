import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// Vitest は globals: true にしていないため、@testing-library/react の
// 自動クリーンアップ（afterEach を検出して実行する仕組み）が効かない。
// 各テスト後に DOM を明示的にクリーンアップする。
afterEach(() => {
  cleanup();
});
