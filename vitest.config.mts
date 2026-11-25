import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      // server-only は本番環境では意図的に import エラーを起こす仕組みのため、
      // React Server Components のレイヤー分離機構を持たない Vitest では空モジュールに差し替える
      "server-only": fileURLToPath(
        new URL("./src/test/mocks/server-only.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    // ファイルごとにjsdom環境を作り直すと起動コストが大きく、テストファイルが
    // 増えるほど並列実行時の負荷が上がってタイムアウトが不安定になる。
    // 環境をワーカー間で共有し、起動コストを減らす。
    isolate: false,
  },
});
