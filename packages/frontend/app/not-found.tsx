"use client";

import { useRouter } from "next/navigation";
import Button from "../components/Button";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="flex flex-col min-h-screen items-center text-center justify-center p-10">
      <h2 className="text-3xl font-bold text-gray-800">Not Found 🧐</h2>
      <p className="mt-4 text-lg text-gray-600">
        {"Ups! Seems like the page you're looking for doesn't exist."}
      </p>
      <div className="mt-6">
        <Button value="Return Home" onPress={() => router.push("/")} />
      </div>
    </main>
  );
}
