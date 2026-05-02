"use client";
import Button from "../components/Button";
import { useNavigate } from "../components/PageTransition";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col gap-8 min-h-screen items-center text-center justify-center p-10 md:px-20 xl:px-100 2xl:px-120">
      <h1 className="text-3xl font-bold text-gray-800">
        Welcome to the Patient Registration Suite
      </h1>
      <p className="mt-4 text-lg text-gray-600 2xl:px-40">
        Please choose between accessing the patient registration form or viewing all registered
        patients.
      </p>
      <div className="flex space-x-4 mt-10">
        <Button value="Add Patient" onPress={() => navigate("/form")} />
        <Button value="View Patients" onPress={() => navigate("/patients")} variant="secondary" />
      </div>
    </main>
  );
}
