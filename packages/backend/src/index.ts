import "dotenv/config";
import express from "express";
import cors from "cors";
import patientsRouter from "./routes/patients";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/patients", patientsRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
