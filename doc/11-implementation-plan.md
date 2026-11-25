# 実装計画

[← 目次に戻る](README.md)

## 進め方

| 項目 | 方針 |
|---|---|
| 実装担当 | Claude が実装し、開発者（本人）がレビューする |
| 作成の単位 | 一度に作成・編集するファイルは5つ前後を目安にする |
| コミットの粒度 | 1コミットあたり、変更ファイルは5つ程度を目安にする（作成の単位とおおむね一致させる） |
| コミットの例外 | `create-next-app` のように、ツールが一度に大量のファイルを生成するものは、生成物をまとめて1コミットにする |
| コミット前の確認 | コミットする前に、開発者がコードを確認する。OK をもらってからコミットする |
| コミットメッセージ | 日本語で書く |
| push | Claude はコミットのみ行い、push は開発者本人が行う |
| ペース | 1フェーズずつ進める。フェーズが終わるたびに確認をもらってから、次のフェーズに進む |
| 品質 | 各フェーズの終わりに、Lint・テストが通った状態にする |

## フェーズ

各フェーズの中はさらにtodoリストとして分割する。チェック1つが、おおむね1コミットの目安（[進め方](#進め方)の「5ファイル前後」に対応）。

### フェーズ0. 土台づくり

- [x] `create-next-app`でプロジェクト作成（TypeScript・Tailwind・App Router）
- [x] ESLint・Prettierの設定
- [x] Gitリポジトリ初期化・最初のコミット
- [x] Neonでプロジェクトを作成し、`DATABASE_URL`を`.env.local`に設定
- [x] Drizzle・`@neondatabase/serverless`をインストールし、接続確認（簡単なクエリが通ることを確認）

**完了の目安**：`npm run dev` で初期画面が表示され、DBに接続できる

### フェーズ1. DBスキーマ

- [x] `lib/schema.ts`：`users`テーブルを定義
- [x] `lib/schema.ts`：`bookmarks`テーブルを定義
- [x] `lib/schema.ts`：`read_articles`テーブルを定義
- [x] `lib/db.ts`：Drizzleクライアントの初期化
- [x] Drizzle Kitでマイグレーションを生成・実行し、Neon上にテーブルが作られることを確認

**完了の目安**：ローカルからNeonの各テーブルにクエリが通る

### フェーズ2. 認証

- [x] `lib/auth.ts`：bcryptでのハッシュ化・照合関数
- [x] `lib/auth.ts`：joseでのJWT発行・検証関数（改ざん・期限切れトークンを弾くテストを先に書く）
- [x] `app/signup/page.tsx`・`components/auth/SignupForm.tsx`
- [x] `app/api/signup/route.ts`：ユーザー名重複チェック→ハッシュ化→INSERT→Cookie発行
- [x] `app/login/page.tsx`・`components/auth/LoginForm.tsx`
- [x] `app/api/login/route.ts`：ユーザー名・パスワード照合→Cookie発行
- [x] `app/api/logout/route.ts`：Cookie削除
- [x] `proxy.ts`：未ログイン時のリダイレクト

**完了の目安**：誰でもサインアップ・ログイン・ログアウトができ、未ログインで保護ページに入れない

### フェーズ3. Zenn API連携

- [x] `types/article.ts`：Article型の定義
- [x] `lib/topics.ts`：41トピックの定義（カテゴリ別）
- [x] `lib/zenn.ts`：Zenn APIを呼ぶ関数（`'use cache'`＋`cacheLife('days')`、User-Agentの設定を含む）
- [x] ローカルで任意のトピックの記事一覧が取得できることを確認

**完了の目安**：ローカルで任意のトピックの記事一覧を取得できる

### フェーズ4. トピック設定・入り口

- [x] `app/api/me/favorite-topics/route.ts`：GET（取得）・PUT（置き換え）
- [x] `hooks/useFavoriteTopics.ts`：TanStack Queryでの取得・更新
- [x] `components/topics/TopicSelector.tsx`：カテゴリ別の選択UI
- [x] `app/topics/page.tsx`：トピック設定画面
- [x] 初回誘導（`?welcome=1`）の表示切り替え（下のタブ・ヘッダーのリンクを隠す）※`components/layout/Header`・`BottomNav`・`Footer`・`AppShell`と合わせて追加対応
- [x] `app/page.tsx`：入り口（クライアントで`useFavoriteTopics`を見て`redirect`）

**完了の目安**：お気に入りの選択・保存・初回誘導が動き、2つ目のアカウントでも独立して動く

### フェーズ5. ホーム画面

- [x] `components/providers/QueryProvider.tsx`をルートレイアウトに組み込む
- [x] `app/topics/[slug]/page.tsx`：`generateStaticParams`で全41トピックを対象にし、未知のslugは`notFound()`で404に。記事一覧を取得・表示（slug依存の処理は`<Suspense>`で囲み、instant navigation検証の警告に対応）
- [x] `components/home/TopicBar.tsx`・`TopicSidebar.tsx`
- [x] `components/home/ArticleCard.tsx`
- [x] `app/api/me/read-articles/route.ts`・`app/api/me/bookmarks/route.ts`（GETのみ）
- [x] `hooks/useReadArticles.ts`・`hooks/useBookmarks.ts`（取得部分のみ）
- [x] `components/home/ArticleList.tsx`・`HomeTabs.tsx`：NEW/READ/BOOKMARKへの振り分けと件数表示

**完了の目安**：任意のトピックのページで記事一覧が表示され、取得後に既読・ブックマークの状態とタブの件数が正しく反映される

### フェーズ6. 既読・ブックマーク操作

- [x] `app/api/me/read-articles/route.ts`：POST（既読追加）を追加
- [x] `app/api/me/bookmarks/route.ts`：POST（追加・100件上限チェック）・DELETE（解除）を追加
- [x] `hooks/useReadArticles.ts`・`hooks/useBookmarks.ts`：mutationと楽観的UI更新を追加
- [x] 記事カードをクリックしたときの既読化
- [x] ブックマークボタンの切り替えと、上限エラーのトースト表示

**完了の目安**：既読化・ブックマークの操作がDBに反映され、タブの表示が更新される

### フェーズ7. ブックマークの確認（当初計画：ブックマーク一覧ページ）

当初は`app/bookmarks/page.tsx`・専用の`BookmarksFeed`コンポーネントを作成したが、ホームのBOOKMARKタブと表示内容が完全に重複していたため削除した。ナビをBOOKMARKタブへのショートカットにする案（`?tab=bookmark`）も実装したが、「タブは常に画面内に見えている」「静的ページ化の妨げになる」という理由で見送り、ナビからBOOKMARKへの個別リンクは置かないことにした（詳細は [フロントエンド・バックエンドの構成](10-structure.md#bookmarkタブへのナビショートカットを見送った理由)）。

- [x] 専用ページ・専用コンポーネントは作らない方針に変更（`app/bookmarks/page.tsx`・`BookmarksFeed.tsx`は削除）
- [x] ナビ（ヘッダー・下タブ）から「BOOKMARK」への個別リンクを削除
- [x] 空の状態の表示（ホームのBOOKMARKタブ側に実装済み、[フェーズ5](#フェーズ5-ホーム画面)参照）

**完了の目安**：自分がブックマークした記事だけを一覧できる

### フェーズ8. 仕上げ

- [x] 空の状態（NEW・READ・BOOKMARKそれぞれ0件のとき。`ArticleList`の`EMPTY_MESSAGE`、フェーズ6で実装済み）
- [x] `app/error.tsx`・`app/not-found.tsx`
- [x] レスポンシブ対応（スマホ・PC）の最終調整（`TopicBar`/`TopicSidebar`の切り替え、`Header`/`BottomNav`の切り替え、`max-w-4xl`での横幅統一、Footerの重なり修正など）
- [x] Vitest：`lib/auth.ts`のテスト（改ざん・期限切れトークンを含む）
- [x] Vitest：主要コンポーネントのテスト（`HomeTabs`・`ArticleCard`・`LoginForm`・`SignupForm`・`TopicSelector`・`useReadArticles`・`useBookmarks`・`useFavoriteTopics`、計40件）
- [x] Lint・テストが通ることを確認

**完了の目安**：[画面](05-screens.md) の仕様を満たし、Lint・テストが通る

### フェーズ9. デプロイ

- [ ] GitHubリポジトリ作成・push
- [ ] Vercelプロジェクト作成・GitHub連携
- [ ] Vercel Postgres（Neon）を本番用に追加
- [ ] 環境変数（`DATABASE_URL`・`AUTH_SECRET`）をVercelに設定
- [ ] 本番DBへのマイグレーション実行
- [ ] GitHub Actions（`.github/workflows/ci.yml`）でLint・テスト・ビルドを設定
- [ ] 本番URLで複数アカウントを作り、動作確認

**完了の目安**：pushでVercelに自動デプロイされ、本番で複数アカウントを作って一通り使える

## この順番にした理由

- **DBスキーマを先に作る（フェーズ1）**：認証・トピック設定・既読・ブックマークのすべてがDBに依存するため、最初に土台を固める
- **認証を早い段階で作る（フェーズ2）**：旧版は1人専用だったため認証を最後に回せたが、今回はマルチユーザーが前提のため、以降の全画面がユーザーIDに依存する。先に作ってしまう
- **Zenn API連携（フェーズ3）**：以降の画面作成で、本物の記事データを使って確認できる
- **既読・ブックマークの操作より先にホーム画面の表示を作る（フェーズ5→6）**：記事一覧の表示とTanStack Queryでの取得・反映を先に固めてから、書き込み系の操作を積む
- **デプロイは最後（フェーズ9）**：ローカルでもNeonの本番相当のDBに繋げて開発できるため、デプロイ特有の調整は環境変数の設定とマイグレーション実行程度に抑えられる見込み

## 旧版で見つかった不具合の再発防止

旧版の `auth.test.ts` で「改ざんされたトークンが有効と判定される」バグが見つかった（検証ロジックを自前実装していたことが原因）。今回はフェーズ2の実装時点で、`verifyAuthToken` の単体テストに次のケースを必ず含める。

- 正しいトークン → true
- 署名を1文字でも改ざんしたトークン → false
- 期限切れのトークン → false
- 形式が壊れたトークン（JWTでない文字列） → false

検証は `jose` の `jwtVerify()` の例外処理だけに任せ、独自の文字列比較・デコード処理を書かないことを徹底する（詳細は [認証](03-auth.md#注意旧版で見つかったバグ)）。
