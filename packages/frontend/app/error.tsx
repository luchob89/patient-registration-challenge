"use client";

import { useEffect } from "react";
import Button from "../components/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-col min-h-screen items-center text-center justify-center p-10">
      <h2 className="text-3xl font-bold text-gray-800">Something went wrong 😵</h2>
      <p className="mt-4 text-lg text-gray-600">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-6">
        <Button value="Try Again" onPress={reset} />
      </div>
    </main>
  );
}
