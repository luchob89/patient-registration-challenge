export default function SkeletonCard() {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-slate-200" />
      <div className="px-3 py-2.5 flex items-center justify-between gap-2">
        <div className="h-3.5 bg-slate-200 rounded-full w-2/3" />
        <div className="w-4 h-4 bg-slate-200 rounded-full shrink-0" />
      </div>
    </div>
  );
}
