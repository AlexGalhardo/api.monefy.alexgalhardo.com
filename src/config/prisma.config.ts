import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
	errorFormat: "minimal",
	log: Bun.env.LOG_PRISMA_QUERIES === "true" ? ["query", "info"] : [],
});

export default prisma;
