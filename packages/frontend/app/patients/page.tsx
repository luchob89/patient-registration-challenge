"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { motion, LayoutGroup } from "framer-motion";
import { useNavigate } from "../../navigation/PageTransition";
import Button from "../../components/Button";
import SkeletonCard from "../../components/SkeletonCard";
import PatientCard, { Patient } from "../../components/PatientCard";
import EmptyState from "../../components/EmptyState";
import PatientsControls, { SortBy, Order } from "../../components/PatientsControls";
import PatientsPagination from "../../components/PatientsPagination";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type PageState = "loading" | "loaded" | "error";

export default function PatientsPage() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>("loading");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [order, setOrder] = useState<Order>("desc");

  // Trigger key increments whenever any query param changes so the effect re-runs
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    axios
      .get<{ data: Patient[]; meta: { total: number; totalPages: number } }>(
        `${API_URL}/patients`,
        { params: { page, limit, sortBy, order } }
      )
      .then((res) => {
        if (!cancelled) {
          setPatients(res.data.data);
          setTotal(res.data.meta.total);
          setTotalPages(res.data.meta.totalPages);
          setPageState("loaded");
        }
      })
      .catch(() => {
        if (!cancelled) setPageState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [fetchKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSortBy = (v: SortBy) => {
    setPage(1);
    setSortBy(v);
    setPageState("loading");
    setFetchKey((k) => k + 1);
  };
  const handleOrder = (v: Order) => {
    setPage(1);
    setOrder(v);
    setPageState("loading");
    setFetchKey((k) => k + 1);
  };
  const handleLimit = (v: number) => {
    setPage(1);
    setLimit(v);
    setPageState("loading");
    setFetchKey((k) => k + 1);
  };
  const goToPage = (p: number) => {
    setPage(p);
    setPageState("loading");
    setFetchKey((k) => k + 1);
  };

  return (
    <div className="w-full min-h-screen px-6 py-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patients</h1>
          {pageState === "loaded" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-400 mt-0.5"
            >
              {total} {total === 1 ? "patient" : "patients"} registered
            </motion.p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            value="Back"
            onPress={() => navigate("/")}
            variant="secondary"
            className="flex-1 sm:flex-none"
          />
          <Button
            value="Add Patient"
            onPress={() => navigate("/form")}
            className="flex-1 sm:flex-none"
          />
        </div>
      </div>

      {/* Controls */}
      <PatientsControls
        sortBy={sortBy}
        order={order}
        limit={limit}
        onSortBy={handleSortBy}
        onOrder={handleOrder}
        onLimit={handleLimit}
      />

      {/* Loading — skeleton grid */}
      {pageState === "loading" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-start">
          {Array.from({ length: limit }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {pageState === "error" && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-28 gap-4 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <Image src="/icons/exclamation-circle.svg" alt="" width={32} height={32} unoptimized />
          </div>
          <div>
            <p className="text-gray-700 font-semibold text-lg">Failed to load patients</p>
            <p className="text-gray-400 text-sm mt-1">
              Could not reach the server. Please try again.
            </p>
          </div>
          <Button
            value="Retry"
            onPress={() => {
              setPageState("loading");
              setFetchKey((k) => k + 1);
            }}
            variant="secondary"
          />
        </motion.div>
      )}

      {/* Empty */}
      {pageState === "loaded" && patients.length === 0 && (
        <EmptyState onAdd={() => navigate("/form")} />
      )}

      {/* Patient grid */}
      {pageState === "loaded" && patients.length > 0 && (
        <LayoutGroup>
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-start"
          >
            {patients.map((patient, i) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                index={i}
                onDeleted={(id) => setPatients((prev) => prev.filter((p) => p.id !== id))}
              />
            ))}
          </motion.div>
        </LayoutGroup>
      )}

      {/* Pagination */}
      {pageState === "loaded" && (
        <PatientsPagination page={page} totalPages={totalPages} onGoToPage={goToPage} />
      )}
    </div>
  );
}
