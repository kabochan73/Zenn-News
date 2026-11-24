import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/home/ArticleCard";
import { getTopicBySlug, TOPICS } from "@/lib/topics";
import { getArticlesByTopic } from "@/lib/zenn";

export function generateStaticParams() {
  return TOPICS.map((topic) => ({ slug: topic.slug }));
}

export default async function TopicPage({
  params,
}: PageProps<"/topics/[slug]">) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  const articles = await getArticlesByTopic(slug);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-6">
      <h1 className="text-lg font-bold">{topic.name}</h1>
      <ul className="flex flex-col">
        {articles.map((article) => (
          <li key={article.id}>
            <ArticleCard
              article={article}
              isRead={false}
              isBookmarked={false}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
