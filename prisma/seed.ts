import { PrismaClient, UserRole } from "@prisma/client";
import Bcrypt from "../src/utils/bcrypt.util";

const prisma = new PrismaClient({
	errorFormat: "pretty",
});

const seedDatabase = async () => {
	await prisma.user.deleteMany({});
	await prisma.expense.deleteMany({});

	await prisma.user.createMany({
		data: [
			{
				name: "ADMIN",
				email: "admin@gmail.com",
				jwt_token: null,
				role: UserRole.ADMIN,
				password: await Bcrypt.hash("adminQWE!123"),
				reset_password_token: null,
				reset_password_token_expires_at: null,
				created_at: new Date(),
				updated_at: null,
			},
			{
				name: "test",
				email: "test@gmail.com",
				jwt_token: null,
				password: await Bcrypt.hash("testQWE!123"),
				reset_password_token: null,
				reset_password_token_expires_at: null,
				created_at: new Date(),
				updated_at: null,
			},
		],
		skipDuplicates: true,
	});
};

seedDatabase();
