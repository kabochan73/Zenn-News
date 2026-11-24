import { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { TopicSelector } from "@/components/topics/TopicSelector";

type SearchParams = PageProps<"/topics">["searchParams"];

async function TopicsPageContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const isWelcome = params.welcome === "1";

  return (
    <AppShell hideNav={isWelcome}>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
        <h1 className="text-xl font-bold">興味のあるトピックを選択</h1>
        <TopicSelector />
      </main>
    </AppShell>
  );
}

export default function TopicsPage(props: PageProps<"/topics">) {
  return (
    <Suspense fallback={null}>
      <TopicsPageContent searchParams={props.searchParams} />
    </Suspense>
  );
}
