"use client";

import { useEffect } from "react";

export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold">エラーが発生しました</h1>
      <p className="text-sm text-zinc-600">
        時間をおいて、もう一度お試しください。
      </p>
      <button
        type="button"
        onClick={retry}
        className="rounded bg-black px-4 py-2 text-white"
      >
        再読み込み
      </button>
    </div>
  );
}
