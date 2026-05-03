"use client";

export type SortBy = "firstName" | "lastName" | "email" | "createdAt";
export type Order = "asc" | "desc";

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "createdAt", label: "Created" },
  { value: "firstName", label: "First name" },
  { value: "lastName", label: "Last name" },
  { value: "email", label: "Email" },
];

const LIMIT_OPTIONS = [5, 10, 20, 50];

const selectClass =
  "rounded-lg border border-indigo-200 bg-white/80 px-3 py-1.5 text-sm text-indigo-900 outline-none focus:ring-2 focus:ring-indigo-300 transition cursor-pointer";

interface PatientsControlsProps {
  sortBy: SortBy;
  order: Order;
  limit: number;
  onSortBy: (v: SortBy) => void;
  onOrder: (v: Order) => void;
  onLimit: (v: number) => void;
}

export default function PatientsControls({
  sortBy,
  order,
  limit,
  onSortBy,
  onOrder,
  onLimit,
}: PatientsControlsProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-6 items-center">
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-indigo-500 whitespace-nowrap">Sort by</label>
        <select
          value={sortBy}
          onChange={(e) => onSortBy(e.target.value as SortBy)}
          className={selectClass}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-indigo-500">Order</label>
        <select
          value={order}
          onChange={(e) => onOrder(e.target.value as Order)}
          className={selectClass}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-indigo-500 whitespace-nowrap">Per page</label>
        <select
          value={limit}
          onChange={(e) => onLimit(Number(e.target.value))}
          className={selectClass}
        >
          {LIMIT_OPTIONS.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
