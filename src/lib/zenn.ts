import "server-only";
import { cacheLife } from "next/cache";
import type { Article } from "@/types/article";

const ZENN_API_BASE = "https://zenn.dev/api/articles";
const USER_AGENT = "ZennNews/1.0 (+https://github.com/kabochan73/Zenn-News)";
const ARTICLES_PER_TOPIC = 100;

type ZennApiArticle = {
  id: number;
  title: string;
  path: string;
  published_at: string;
  user: {
    name: string;
    avatar_small_url: string | null;
  };
};

type ZennApiResponse = {
  articles: ZennApiArticle[];
};

export async function getArticlesByTopic(
  topicSlug: string,
): Promise<Article[]> {
  "use cache";
  cacheLife("days");

  const url = `${ZENN_API_BASE}?topicname=${encodeURIComponent(topicSlug)}&order=latest&count=${ARTICLES_PER_TOPIC}`;
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!res.ok) {
    throw new Error(`Zenn APIの取得に失敗しました（status: ${res.status}）`);
  }

  const data: ZennApiResponse = await res.json();

  return data.articles.map((article) => ({
    id: article.id,
    title: article.title,
    path: article.path,
    publishedAt: article.published_at,
    author: {
      name: article.user.name,
      avatarUrl: article.user.avatar_small_url,
    },
  }));
}
