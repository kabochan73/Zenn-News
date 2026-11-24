# Zenn News（マルチユーザー版）設計資料

ハッカソン向けに、誰でもサインアップして使える Zenn ニュースアプリの設計資料。

旧版（開発者本人1人だけが使う前提・`~/Desktop/ZennNews`）をベースに、認証をユーザー名＋パスワードのサインアップ制に、個人データ（既読・ブックマーク・お気に入りトピック）を localStorage から DB（Vercel Postgres／Neon）に変更している。

## 目次

1. [概要・技術構成](01-overview.md)
2. [機能要件](02-features.md)
3. [認証](03-auth.md)
4. [記事の取得（ISR）](04-article-fetch.md)
5. [画面](05-screens.md)
6. [データモデル（DB設計）](06-data-model.md)
7. [非機能要件](07-non-functional.md)
8. [インフラ・開発運用](08-infrastructure.md)
9. [技術スタック詳細](09-tech-stack.md)
10. [フロントエンド・バックエンドの構成](10-structure.md)
11. [実装計画](11-implementation-plan.md)
