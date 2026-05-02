-- CreateTable
CREATE TABLE "patients" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "country_code" VARCHAR(4) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "photo" BYTEA NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patients_email_key" ON "patients"("email");
