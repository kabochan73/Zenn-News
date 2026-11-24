"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFavoriteTopics } from "@/hooks/useFavoriteTopics";
import { getTopicsByCategory, TOPIC_CATEGORIES } from "@/lib/topics";

export function TopicSelector() {
  const router = useRouter();
  const { favoriteTopics, isLoading, save, isSaving, saveError } =
    useFavoriteTopics();
  const [selected, setSelected] = useState<string[]>([]);
  const [initializedFrom, setInitializedFrom] = useState<string[] | null>(null);

  // 取得が終わった直後、1回だけ favoriteTopics を selected の初期値として取り込む。
  // TanStack Query はデータが変わらない限り同じ参照を返すため、2回目以降はこの分岐に入らない。
  if (!isLoading && favoriteTopics !== initializedFrom) {
    setInitializedFrom(favoriteTopics);
    setSelected(favoriteTopics);
  }

  const hasInitialized = initializedFrom !== null;

  function toggleTopic(slug: string) {
    setSelected((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug],
    );
  }

  async function handleSave() {
    if (selected.length === 0) {
      return;
    }
    const saved = await save(selected);
    router.push(`/topics/${saved[0]}`);
  }

  if (isLoading || !hasInitialized) {
    return <p className="text-sm text-zinc-500">読み込み中...</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      {TOPIC_CATEGORIES.map((category) => {
        const topics = getTopicsByCategory(category);
        const selectedCount = topics.filter((topic) =>
          selected.includes(topic.slug),
        ).length;

        return (
          <section key={category} className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-semibold">{category}</h2>
              <span className="text-xs text-zinc-500">
                {selectedCount}/{topics.length} 選択中
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => {
                const isSelected = selected.includes(topic.slug);
                return (
                  <button
                    key={topic.slug}
                    type="button"
                    onClick={() => toggleTopic(topic.slug)}
                    className={
                      isSelected
                        ? "rounded-full bg-black px-3 py-1.5 text-sm text-white"
                        : "rounded-full border border-zinc-300 px-3 py-1.5 text-sm text-black"
                    }
                  >
                    {isSelected ? `✓ ${topic.name}` : topic.name}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      {saveError && <p className="text-sm text-red-600">{saveError.message}</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={selected.length === 0 || isSaving}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-40"
      >
        保存する
      </button>
    </div>
  );
}
