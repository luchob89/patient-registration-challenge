import Image from "next/image";

export default function DetailRow({
  iconSrc,
  label,
}: {
  iconSrc: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-600 min-w-0">
      <Image src={iconSrc} alt="" width={14} height={14} className="shrink-0" unoptimized />
      <span className="truncate">{label}</span>
    </div>
  );
}
