"use client";

interface PatientsPaginationProps {
  page: number;
  totalPages: number;
  onGoToPage: (p: number) => void;
}

export default function PatientsPagination({
  page,
  totalPages,
  onGoToPage,
}: PatientsPaginationProps) {
  if (totalPages <= 1) return null;

  const items = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    .reduce<(number | "…")[]>((acc, p, idx, arr) => {
      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
      acc.push(p);
      return acc;
    }, []);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        type="button"
        onClick={() => onGoToPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-3 py-1.5 rounded-lg border border-indigo-200 bg-white/80 text-sm text-indigo-700 font-medium hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        Prev
      </button>

      {items.map((item, idx) =>
        item === "…" ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-indigo-300 text-sm select-none">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onGoToPage(item as number)}
            className={`w-9 h-9 rounded-lg border text-sm font-medium transition ${
              page === item
                ? "bg-indigo-400 border-indigo-400 text-white"
                : "border-indigo-200 bg-white/80 text-indigo-700 hover:bg-indigo-50"
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onGoToPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="px-3 py-1.5 rounded-lg border border-indigo-200 bg-white/80 text-sm text-indigo-700 font-medium hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        Next
      </button>
    </div>
  );
}
