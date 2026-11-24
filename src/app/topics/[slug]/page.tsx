import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArticleList } from "@/components/home/ArticleList";
import { TopicBar } from "@/components/home/TopicBar";
import { TopicSidebar } from "@/components/home/TopicSidebar";
import { AppShell } from "@/components/layout/AppShell";
import { getTopicBySlug, TOPICS } from "@/lib/topics";
import { getArticlesByTopic } from "@/lib/zenn";

export function generateStaticParams() {
  return TOPICS.map((topic) => ({ slug: topic.slug }));
}

type Params = PageProps<"/topics/[slug]">["params"];

async function TopicFeed({ params }: { params: Params }) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  const articles = await getArticlesByTopic(slug);

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <TopicSidebar activeSlug={slug} />
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
        <TopicBar activeSlug={slug} />
        <ArticleList articles={articles} />
      </div>
    </div>
  );
}

export default function TopicPage(props: PageProps<"/topics/[slug]">) {
  return (
    <AppShell>
      <Suspense
        fallback={
          <p className="px-4 py-8 text-sm text-zinc-500">読み込み中...</p>
        }
      >
        <TopicFeed params={props.params} />
      </Suspense>
    </AppShell>
  );
}
