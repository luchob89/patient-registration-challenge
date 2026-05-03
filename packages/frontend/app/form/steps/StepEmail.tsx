"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setEmail } from "../../../store/slices/patientSlice";
import { useFormContext } from "../context/FormContext";
import axios from "axios";
import Button from "../../../components/Button";
import FieldError from "../../../components/FieldError";
import FormInput from "../../../components/FormInput";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const schema = z.object({
  email: z
    .email("Please enter a valid email address")
    .max(100, "Email must be at most 100 characters")
    .refine((v) => v.toLowerCase().endsWith("@gmail.com"), {
      message: "Only @gmail.com addresses are accepted",
    }),
});

type EmailFormData = z.infer<typeof schema>;

export default function StepEmail() {
  const dispatch = useAppDispatch();
  const { goNext, goPrev } = useFormContext();
  const savedEmail = useAppSelector((s) => s.patient.email);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, submitCount, isSubmitting },
  } = useForm<EmailFormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: savedEmail },
  });

  const onSubmit = async (data: EmailFormData) => {
    try {
      const { data: result } = await axios.get<{ exists: boolean }>(
        `${API_URL}/patients/check-email`,
        { params: { email: data.email.toLowerCase() } },
      );
      if (result.exists) {
        setError("email", { message: "This email is already registered." });
        return;
      }
    } catch {
      setError("email", { message: "Could not verify email. Please try again." });
      return;
    }
    dispatch(setEmail(data.email));
    goNext();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-indigo-700" htmlFor="email">
          Email Address
        </label>
        <FormInput
          id="email"
          type="email"
          {...register("email")}
          placeholder="e.g. john.doe@gmail.com"
          hasError={!!errors.email}
          submitCount={submitCount}
          className="rounded-lg border border-indigo-200 bg-white/80 px-4 py-2.5 text-sm text-indigo-900 placeholder-indigo-300 outline-none focus:ring-2 focus:ring-indigo-300 transition"
        />
        <FieldError message={errors.email?.message} />
        <p className="text-xs text-indigo-400">
          Only <span className="font-medium">@gmail.com</span> addresses are accepted
        </p>
      </div>

      <div className="flex justify-between pt-2">
        <Button
          value="Back"
          variant="secondary"
          onPress={goPrev}
          type="button"
        />
        <Button value={isSubmitting ? "Checking…" : "Next"} type="submit" />
      </div>
    </form>
  );
}
