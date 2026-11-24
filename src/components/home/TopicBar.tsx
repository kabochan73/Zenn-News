"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useFavoriteTopics } from "@/hooks/useFavoriteTopics";
import { getTopicBySlug } from "@/lib/topics";

type TopicBarProps = {
  activeSlug: string;
};

export function TopicBar({ activeSlug }: TopicBarProps) {
  const { favoriteTopics } = useFavoriteTopics();
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [activeSlug]);

  const topics = favoriteTopics
    .map((slug) => getTopicBySlug(slug))
    .filter((topic): topic is NonNullable<typeof topic> => topic !== undefined);

  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-zinc-200 px-4 py-2 lg:hidden">
      {topics.map((topic) => (
        <Link
          key={topic.slug}
          ref={topic.slug === activeSlug ? activeRef : undefined}
          href={`/topics/${topic.slug}`}
          className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${
            topic.slug === activeSlug
              ? "bg-black text-white"
              : "border border-zinc-300 text-black"
          }`}
        >
          {topic.name}
        </Link>
      ))}
    </nav>
  );
}
