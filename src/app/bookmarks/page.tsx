import { BookmarksFeed } from "@/components/home/BookmarksFeed";

export default function BookmarksPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-6">
      <h1 className="text-lg font-bold">ブックマーク</h1>
      <BookmarksFeed />
    </main>
  );
}
