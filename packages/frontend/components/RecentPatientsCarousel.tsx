"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Patient } from "./PatientCard";
import PatientMiniCard from "./PatientMiniCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const INTERVAL_MS = 2800;

export default function RecentPatientsCarousel() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    axios
      .get<{ data: Patient[] }>(`${API_URL}/patients`, {
        params: { limit: 4, sortBy: "createdAt", order: "desc" },
      })
      .then((res) => setPatients(res.data.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (patients.length < 2) return;
    timerRef.current = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % patients.length);
    }, INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [patients]);

  if (patients.length === 0) return null;

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -40 }),
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-2">
      <p className="text-sm font-medium text-gray-400 tracking-wide uppercase">
        Last registered patients
      </p>

      <div className="relative flex items-center justify-center gap-4 overflow-hidden w-full max-w-xs h-36">
        <AnimatePresence mode="popLayout" custom={direction}>
          {patients.map((patient, i) =>
            i === index ? (
              <motion.div
                key={patient.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <PatientMiniCard patient={patient} />
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="flex gap-1.5">
        {patients.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to patient ${i + 1}`}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
              i === index ? "bg-indigo-400" : "bg-indigo-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
