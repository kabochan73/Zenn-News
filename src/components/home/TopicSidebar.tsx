"use client";

import Link from "next/link";
import { useFavoriteTopics } from "@/hooks/useFavoriteTopics";
import { getTopicBySlug } from "@/lib/topics";

type TopicSidebarProps = {
  activeSlug: string;
};

export function TopicSidebar({ activeSlug }: TopicSidebarProps) {
  const { favoriteTopics } = useFavoriteTopics();

  const topics = favoriteTopics
    .map((slug) => getTopicBySlug(slug))
    .filter((topic): topic is NonNullable<typeof topic> => topic !== undefined);

  return (
    <nav className="hidden w-48 shrink-0 flex-col gap-1 border-r border-zinc-200 px-4 py-4 lg:flex">
      {topics.map((topic) => (
        <Link
          key={topic.slug}
          href={`/topics/${topic.slug}`}
          className={`rounded px-2 py-1.5 text-sm ${
            topic.slug === activeSlug
              ? "bg-zinc-100 font-semibold"
              : "text-zinc-600"
          }`}
        >
          {topic.slug === activeSlug ? "● " : ""}
          {topic.name}
        </Link>
      ))}
    </nav>
  );
}
