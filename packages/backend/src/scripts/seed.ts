import "dotenv/config";
import { readFileSync } from "fs";
import { join } from "path";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { faker } from "@faker-js/faker";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const COUNTRY_CODES = [
  "1",
  "7",
  "33",
  "34",
  "39",
  "44",
  "49",
  "52",
  "54",
  "55",
  "57",
  "61",
  "81",
  "86",
  "91",
];
const TOTAL = 100;

async function main() {
  console.log(`\nSeeding ${TOTAL} patients...\n`);

  const photoPath = join(__dirname, "../../user_placeholder.png");
  const photo = new Uint8Array(
    readFileSync(photoPath),
  ) as Uint8Array<ArrayBuffer>;
  console.log("  ✓ Loaded placeholder photo from Desktop.\n");

  const seen = new Set<string>();
  const records: {
    firstName: string;
    lastName: string;
    email: string;
    countryCode: string;
    phone: string;
    photo: Uint8Array<ArrayBuffer>;
    createdAt: Date;
  }[] = [];

  while (records.length < TOTAL) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const base = `${firstName.toLowerCase().replace(/[^a-z]/g, "")}.${lastName.toLowerCase().replace(/[^a-z]/g, "")}`;
    const email = `${base}${faker.number.int({ min: 1, max: 9999 })}@gmail.com`;

    if (seen.has(email)) continue;
    seen.add(email);

    records.push({
      firstName,
      lastName,
      email,
      countryCode: faker.helpers.arrayElement(COUNTRY_CODES),
      phone: faker.string.numeric(9),
      photo,
      createdAt: faker.date.between({
        from: new Date("2024-01-01"),
        to: new Date(),
      }),
    });
  }

  await prisma.patient.createMany({ data: records });
  console.log(`  ✓ Inserted ${TOTAL} patients.\n`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
