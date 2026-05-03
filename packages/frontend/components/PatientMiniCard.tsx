"use client";

import { Patient } from "./PatientCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function PatientMiniCard({ patient }: { patient: Patient }) {
  return (
    <div className="flex flex-col items-center gap-2 w-28 shrink-0">
      <div className="w-30 h-24 rounded-2xl overflow-hidden bg-slate-100 border border-white/80 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${API_URL}/patients/${patient.id}/photo`}
          alt={`${patient.firstName} ${patient.lastName}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <span className="text-xs font-semibold text-gray-700 text-center leading-tight line-clamp-2">
        {patient.firstName} {patient.lastName}
      </span>
    </div>
  );
}
