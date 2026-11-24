import { TopicSelector } from "@/components/topics/TopicSelector";

export default function TopicsPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
      <h1 className="text-xl font-bold">興味のあるトピックを選択</h1>
      <TopicSelector />
    </main>
  );
}
