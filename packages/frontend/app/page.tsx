"use client";
import { motion, type Variants } from "framer-motion";
import Button from "../components/Button";
import { useNavigate } from "../navigation/PageTransition";
import RecentPatientsCarousel from "../components/RecentPatientsCarousel";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.3, ease: "easeOut" },
  }),
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-10 flex flex-col items-center text-center gap-6">
        <motion.h1
          className="text-3xl font-bold text-indigo-800"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
        >
          Welcome to the Patient Registration Suite
        </motion.h1>
        <motion.p
          className="text-md text-indigo-400"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
        >
          Choose between accessing the patient registration form or viewing all registered patients.
        </motion.p>
        <motion.div
          className="flex space-x-4"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
        >
          <Button value="Add Patient" onPress={() => navigate("/form")} />
          <Button value="View Patients" onPress={() => navigate("/patients")} variant="secondary" />
        </motion.div>
        <motion.div
          className="w-full"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
        >
          <RecentPatientsCarousel />
        </motion.div>
      </div>
    </main>
  );
}
