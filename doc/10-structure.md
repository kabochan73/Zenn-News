# フロントエンド・バックエンドの構成

[← 目次に戻る](README.md)

## フォルダ構成

```
src/
├── proxy.ts                         認証チェック（/login, /signup 以外のすべてのパスを保護。JWT検証のみ）
├── app/                                  画面とルーティング（App Router）
│   ├── layout.tsx                        ルートのレイアウト（ヘッダー、フッター、QueryProviderを含む）
│   ├── globals.css
│   ├── not-found.tsx                     404ページ
│   ├── error.tsx                         エラー画面
│   ├── page.tsx                          入り口            /（クライアントでお気に入りトピックを見て移動先を決める）
│   ├── login/page.tsx                    ログイン           /login
│   ├── signup/page.tsx                   サインアップ       /signup
│   ├── topics/
│   │   ├── page.tsx                      トピック設定       /topics（初回は ?welcome=1）
│   │   └── [slug]/page.tsx               ホーム（ISR）      /topics/nextjs など
│   ├── bookmarks/page.tsx                ブックマーク一覧   /bookmarks
│   └── api/
│       ├── signup/route.ts               ユーザー作成：重複チェック→bcryptハッシュ化→INSERT→Cookie発行
│       ├── login/route.ts                ログイン：ユーザー名で検索→bcrypt照合→Cookie発行
│       ├── logout/route.ts               ログアウト：Cookie削除
│       └── me/                           ログイン中ユーザー自身のデータ（Cookieから改めてJWTをデコードして特定）
│           ├── favorite-topics/route.ts  GET取得・PUT置き換え
│           ├── read-articles/route.ts    GET取得・POST追加
│           └── bookmarks/route.ts        GET取得・POST追加・DELETE削除（100件上限チェック）
├── components/
│   ├── providers/QueryProvider.tsx       TanStack Queryの `QueryClientProvider`（CC）
│   ├── ui/                               自作の汎用部品（Button、Toast）
│   ├── layout/                           Header（ログアウトボタン含む）、BottomNav、Footer
│   ├── home/                             TopicBar、TopicSidebar、HomeTabs、ArticleCard、ArticleList
│   ├── topics/                           TopicSelector（カテゴリ別のトピック選択）
│   └── auth/                             LoginForm、SignupForm
├── hooks/
│   ├── useFavoriteTopics.ts              TanStack Queryでお気に入りトピックを取得・更新（`/api/me/favorite-topics`）
│   ├── useReadArticles.ts                TanStack Queryで既読記事IDを取得・追加（`/api/me/read-articles`）
│   └── useBookmarks.ts                   TanStack Queryでブックマークを取得・追加・削除（`/api/me/bookmarks`、100件上限チェック）
├── lib/
│   ├── db.ts                             Drizzleクライアント初期化（Neon serverless driver）
│   ├── schema.ts                         Drizzle schema（users / bookmarks / read_articles）
│   ├── zenn.ts                           Zenn APIを呼ぶ関数（Server Componentから使う）
│   ├── topics.ts                         41トピックの定義（slug・表示名・カテゴリ）
│   ├── auth.ts                           JWTの発行・検証（jose）、bcryptハッシュ・照合、getSession()
│   └── format.ts                         日時の表示（9/23 14:05）
├── types/
│   └── article.ts                        Article・Bookmarkの型
└── test/                                 Vitestのテスト
```

- `components/` の中は画面ごとに分ける
- Zenn APIはServer Componentから直接呼ぶため、`api/`には認証系と個人データ系（`me/`）のRoute Handlerのみ置く
- 個人データ（既読・ブックマーク・お気に入りトピック）はすべて `hooks/*` 経由（TanStack Query）でクライアントから取得・更新する。旧版の `hooks/*`（localStorageの読み書き）と役割は同じだが、今回はDBを呼ぶAPIを経由する

## レンダリング方式

| 画面 | 方式 | 理由 |
|---|---|---|
| `/login`・`/signup` | SSG ＋ ブラウザで処理 | フォームの入力・送信のみ |
| `/`（入り口） | SSG ＋ ブラウザで処理 | `useFavoriteTopics`（TanStack Query）で取得し、クライアントで最初のトピック（または `/topics?welcome=1`）へ `router.replace()` する |
| `/topics/[slug]` | **静的（`generateStaticParams`で全41トピックをビルド時に生成、`'use cache'`＋`cacheLife`で更新）** | Zenn APIから取得した記事一覧は全ユーザー共通なので、トピックごとにページ全体をキャッシュできる（詳細は [記事の取得](04-article-fetch.md)）。既読・🔖の状態は `useReadArticles`・`useBookmarks` がクライアントで取得して重ねる |
| `/topics` | SSG ＋ ブラウザで処理 | トピック一覧（41個）は固定なのでビルド時に作る。選択状態は `useFavoriteTopics` で取得する |
| `/bookmarks` | SSG の枠 ＋ ブラウザで処理 | ページ自体は固定の枠のみ。内容は `useBookmarks` がクライアントで取得する。Zenn APIへのアクセスは発生しない |
| `not-found` | SSG | 固定の内容 |

### 認証（Middleware）とISRの関係

- `/topics/[slug]` の認証チェックは `proxy.ts` が行う。ページ自体はCookieを読まないので、全員共通のHTMLをISRでキャッシュできる
- Middlewareで未ログインと判定された場合は、ISRのキャッシュを返す前に `/login` へリダイレクトする（キャッシュされたHTMLが未ログインのブラウザに渡ることはない）
- 個人データ（`/api/me/**`）のRoute Handlerは、Cookieから改めてJWTをデコードしてユーザーを特定する。`proxy.ts`と同じ検証ロジック（`lib/auth.ts`）を使う

### `/topics/[slug]` を静的化した理由

- 記事一覧は全員（＝全ユーザー）共通のデータなので、ページとしてキャッシュできる
- 個人データ（既読・ブックマーク）はDBにあるが、ページ自体を静的化するには、ページの中でCookie・DBを読まないようにする必要がある。そのため既読・ブックマークの反映はクライアント側（`useReadArticles`・`useBookmarks`、TanStack Query）で行う
- インストールされているNext.js 16はCache Components（`'use cache'`）が既定で有効で、素の`'use cache'`はサーバーレス環境だとリクエスト間で保持されない場合があるため、トピックが41個の固定リストであることを利用して`generateStaticParams`で全件をビルド時に静的化する（詳細は [記事の取得](04-article-fetch.md#ビルド時に全トピックを静的化するgeneratestaticparams)）

### 既読・ブックマークをクライアント側で取得する理由（設計の経緯）

当初はServer Component内でZenn API（キャッシュあり）とDB（キャッシュなし、リクエスト毎）を合成してから返す設計も検討した。この場合、表示のチラつきは起きないが、ページ自体が動的になるためトピックを切り替えるたびに（＝ページ遷移のたびに）DBへの問い合わせが発生し、切り替え回数が多いユーザーが増えるとDB負荷がそれに比例して増えてしまう。

今回はTanStack Queryでクライアント側に既読・ブックマーク・お気に入りトピックをキャッシュする方式を採用した。トピックを何度切り替えても、キャッシュが新しい間（`staleTime`内）はDBへ再度問い合わせない。トレードオフとして、ページ表示直後の一瞬は全記事がNEW扱いで表示され、取得が完了した時点でREAD/BOOKMARKの表示に切り替わることがある（旧版のlocalStorage版と同じ挙動で、今回もこれを許容する）。

## Server ComponentとClient Componentの分け方

**基本ルール**：ページとレイアウトはServer Component（SC）にする。`'use client'`は、状態・クリック操作が必要な末端の部品にだけ付ける。

| ファイル | 種類 | 理由 |
|---|---|---|
| `app/layout.tsx` | SC | ヘッダー・フッターを並べ、`QueryProvider`（CC）で全体を包む |
| `app/page.tsx`（入り口） | SC | 中で移動処理用の小さなCC（`useFavoriteTopics`を使う）を表示するだけ |
| `app/login/page.tsx`・`app/signup/page.tsx` | SC | フォームの部分だけ`LoginForm`・`SignupForm`（CC）に任せる |
| `app/topics/[slug]/page.tsx` | SC（ISR） | `lib/zenn.ts`で記事一覧を取得し、propsとして`ArticleList`（CC）に渡す。DBは読まない |
| `app/topics/page.tsx` | SC | トピック一覧（固定データ）をpropsとして`TopicSelector`（CC）に渡す。現在の選択状態は`TopicSelector`内で`useFavoriteTopics`が取得する |
| `app/bookmarks/page.tsx` | SC | 枠だけ。内容は中のCCが`useBookmarks`で取得する |
| `components/providers/QueryProvider` | CC | `QueryClientProvider`を提供するため |
| `components/layout/Header`・`Footer` | SC | リンクと文字だけ。ログアウトボタンだけ内部で小さなCCに切り出す |
| `components/layout/BottomNav` | CC | 今のURL（`usePathname`）で、強調するタブを変えるため |
| `components/home/*` | CC | タブ・トピックの切り替え、`useReadArticles`・`useBookmarks`での取得・操作があるため |
| `components/topics/TopicSelector` | CC | `useFavoriteTopics`で現在の選択状態を取得し、保存時に更新を呼ぶため |
| `components/auth/LoginForm`・`SignupForm` | CC | 入力値の管理とAPIへの送信があるため |
| `components/ui/Toast` | CC | 表示・非表示の状態を持つため |
| `hooks/*` | CC専用 | TanStack Queryは`'use client'`配下で使うため |
| `lib/zenn.ts`・`lib/db.ts`・`lib/schema.ts` | サーバー専用 | `import 'server-only'` を付けて、ブラウザ側のコードに入り込むのを防ぐ |
| `lib/auth.ts` | サーバー専用 | JWTの署名鍵（`AUTH_SECRET`）・bcryptを扱うため、`proxy.ts`とAPI Route Handlerからのみ呼ぶ |
| `proxy.ts` | Edge Middleware | Next.jsの仕組み上、SC/CCの分類の外。全パスの手前で1回だけ実行される |
