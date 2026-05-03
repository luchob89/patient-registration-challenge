import { Router } from "express";
import { upload } from "../helpers/upload";
import {
  listPatients,
  checkEmail,
  getPatientPhoto,
  createPatient,
  deletePatient,
  resendEmail,
} from "./patients.controller";

const router = Router();

router.get("/", listPatients);

router.get("/check-email", checkEmail);

router.get("/:id/photo", getPatientPhoto);

router.post("/", upload.single("photo"), createPatient);

router.delete("/:id", deletePatient);

router.post("/:id/resend-email", resendEmail);

export default router;

