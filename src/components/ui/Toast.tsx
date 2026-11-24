"use client";

import { useEffect } from "react";

type ToastProps = {
  message: string;
  onDismiss: () => void;
};

export function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed inset-x-0 bottom-20 z-50 mx-auto w-fit max-w-[90vw] rounded bg-black px-4 py-2 text-sm text-white shadow lg:bottom-6">
      {message}
    </div>
  );
}
