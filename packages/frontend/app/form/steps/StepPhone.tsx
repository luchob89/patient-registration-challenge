"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  setPhone,
  setPhoneCountryCode,
} from "../../../store/slices/patientSlice";
import { useFormContext } from "../context/FormContext";
import Button from "../../../components/Button";
import FieldError from "../../../components/FieldError";
import FormInput from "../../../components/FormInput";

const schema = z.object({
  countryCode: z
    .string()
    .min(1, "Country code is required")
    .regex(/^\d{1,4}$/, "Enter 1–4 digits"),
  number: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d{6,12}$/, "Enter 6–12 digits, no spaces or dashes"),
});

type PhoneFormData = z.infer<typeof schema>;

export default function StepPhone() {
  const dispatch = useAppDispatch();
  const { goNext, goPrev } = useFormContext();
  const savedCountryCode = useAppSelector((s) => s.patient.phoneCountryCode);
  const savedPhone = useAppSelector((s) => s.patient.phone);

  const savedNumber =
    savedCountryCode && savedPhone.startsWith(`+${savedCountryCode}`)
      ? savedPhone.slice(savedCountryCode.length + 1)
      : "";

  const {
    register,
    handleSubmit,
    formState: { errors, submitCount },
  } = useForm<PhoneFormData>({
    resolver: zodResolver(schema),
    defaultValues: { countryCode: savedCountryCode, number: savedNumber },
  });

  const onSubmit = (data: PhoneFormData) => {
    dispatch(setPhoneCountryCode(data.countryCode));
    dispatch(setPhone(`+${data.countryCode}${data.number}`));
    goNext();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-indigo-700">
          Phone Number
        </label>
        <div className="flex gap-2">
          <div className="flex flex-col gap-1 w-28 shrink-0">
            <div className="relative flex items-center">
              <span className="absolute left-3 text-sm font-medium text-indigo-500 pointer-events-none select-none">
                +
              </span>
              <FormInput
                id="countryCode"
                type="tel"
                inputMode="numeric"
                maxLength={4}
                {...register("countryCode")}
                placeholder="598"
                hasError={!!errors.countryCode}
                submitCount={submitCount}
                onKeyDown={(e) => { if (/^[a-zA-Z]$/.test(e.key)) e.preventDefault(); }}
                className="rounded-lg border border-indigo-200 bg-white/80 pl-6 pr-3 py-2.5 text-sm text-indigo-900 placeholder-indigo-300 outline-none focus:ring-2 focus:ring-indigo-300 transition w-full"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <FormInput
              id="number"
              type="tel"
              inputMode="numeric"
              maxLength={12}
              {...register("number")}
              placeholder="123456789"
              hasError={!!errors.number}
              submitCount={submitCount}
              onKeyDown={(e) => { if (/^[a-zA-Z]$/.test(e.key)) e.preventDefault(); }}
              className="rounded-lg border border-indigo-200 bg-white/80 px-4 py-2.5 text-sm text-indigo-900 placeholder-indigo-300 outline-none focus:ring-2 focus:ring-indigo-300 transition w-full"
            />
          </div>
        </div>
        <FieldError
          message={errors.countryCode?.message ?? errors.number?.message}
        />
        <p className="text-xs text-indigo-400">
          Country code (e.g. <span className="font-medium">+598</span>) followed
          by your local number
        </p>
      </div>

      <div className="flex justify-between pt-2">
        <Button
          value="Back"
          variant="secondary"
          onPress={goPrev}
          type="button"
        />
        <Button value="Next" type="submit" />
      </div>
    </form>
  );
}
