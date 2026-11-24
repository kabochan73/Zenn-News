// テスト環境（Vitest）には React Server Components のレイヤー分離機構がなく、
// 本物の server-only パッケージは import された時点で無条件にエラーを投げる。
// vitest.config.mts の resolve.alias で、本番コードからの import をこの空モジュールに差し替える。
export {};
