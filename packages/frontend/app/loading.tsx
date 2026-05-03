export default function Loading() {
  return (
    <main className="flex flex-col min-h-screen items-center text-center justify-center p-10">
      <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin" />
      <p className="mt-4 text-lg text-gray-600">Loading...</p>
    </main>
  );
}
