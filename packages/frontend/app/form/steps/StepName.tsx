"use client";

import { useGoBack } from "../../../components/PageTransition";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  setFirstName,
  setLastName,
  resetPatient,
} from "../../../store/slices/patientSlice";
import { useFormContext } from "../context/FormContext";
import Button from "../../../components/Button";
import FieldError from "../../../components/FieldError";
import FormInput from "../../../components/FormInput";

const schema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters")
    .regex(
      /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
      "First name contains invalid characters"
    ),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters")
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, "Last name contains invalid characters"),
});

type NameFormData = z.infer<typeof schema>;

export default function StepName() {
  const goBack = useGoBack();
  const dispatch = useAppDispatch();
  const { goNext } = useFormContext();
  const savedFirstName = useAppSelector((s) => s.patient.firstName);
  const savedLastName = useAppSelector((s) => s.patient.lastName);

  const {
    register,
    handleSubmit,
    formState: { errors, submitCount },
  } = useForm<NameFormData>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: savedFirstName, lastName: savedLastName },
  });

  const onSubmit = (data: NameFormData) => {
    dispatch(setFirstName(data.firstName));
    dispatch(setLastName(data.lastName));
    goNext();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-1">
        <label
          className="text-sm font-medium text-indigo-700"
          htmlFor="firstName"
        >
          First Name
        </label>
        <FormInput
          id="firstName"
          {...register("firstName")}
          placeholder="e.g. John"
          hasError={!!errors.firstName}
          submitCount={submitCount}
          onKeyDown={(e) => { if (/^\d$/.test(e.key)) e.preventDefault(); }}
          className="rounded-lg border border-indigo-200 bg-white/80 px-4 py-2.5 text-sm text-indigo-900 placeholder-indigo-300 outline-none focus:ring-2 focus:ring-indigo-300 transition"
        />
        <FieldError message={errors.firstName?.message} />
      </div>

      <div className="flex flex-col gap-1">
        <label
          className="text-sm font-medium text-indigo-700"
          htmlFor="lastName"
        >
          Last Name
        </label>
        <FormInput
          id="lastName"
          {...register("lastName")}
          placeholder="e.g. Doe"
          hasError={!!errors.lastName}
          submitCount={submitCount}
          onKeyDown={(e) => { if (/^\d$/.test(e.key)) e.preventDefault(); }}
          className="rounded-lg border border-indigo-200 bg-white/80 px-4 py-2.5 text-sm text-indigo-900 placeholder-indigo-300 outline-none focus:ring-2 focus:ring-indigo-300 transition"
        />
        <FieldError message={errors.lastName?.message} />
      </div>

      <div className="flex justify-between pt-2">
        <Button
          value="Back"
          variant="secondary"
          onPress={() => {
            dispatch(resetPatient());
            goBack();
          }}
          type="button"
        />
        <Button value="Next" type="submit" />
      </div>
    </form>
  );
}
