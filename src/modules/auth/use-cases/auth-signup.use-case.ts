import { randomUUID } from "node:crypto";
import type { User } from "@prisma/client";
import * as jwt from "jsonwebtoken";
import RabbitMQ from "src/config/rabbitmq.config";
import { redis } from "src/config/redis.config";
import { AuthSignupValidator } from "src/validators/auth-signup.validator";
import UsersRepository, { type UsersRepositoryPort } from "../../../repositories/users.repository";
import Bcrypt from "../../../utils/bcrypt.util";

interface AuthSignupUseCaseResponse {
	success: boolean;
	data?: User;
	error?: string;
}

export interface AuthSignupDTO {
	name: string;
	email: string;
	password: string;
}

export interface AuthSignupUseCasePort {
	execute(authSignupPayload: AuthSignupDTO): Promise<AuthSignupUseCaseResponse>;
}

export default class AuthSignupUseCase implements AuthSignupUseCasePort {
	constructor(
		private readonly usersRepository: UsersRepositoryPort = new UsersRepository(),
		private readonly rabbitMq = new RabbitMQ(),
	) {}

	async execute(authSignupPayload: AuthSignupDTO): Promise<AuthSignupUseCaseResponse> {
		try {
			AuthSignupValidator.parse(authSignupPayload);

			const emailAlreadyRegistred = await this.usersRepository.findByEmail(authSignupPayload.email);

			if (!emailAlreadyRegistred) {
				const { name, email, password } = authSignupPayload;

				const user_id = randomUUID();

				const jwt_token = jwt.sign({ user_email: email }, Bun.env.JWT_SECRET as string);

				const userCreated = await this.usersRepository.create({
					id: user_id,
					name,
					email,
					password: await Bcrypt.hash(password),
					jwt_token,
				});

				if (userCreated) {
					const savedInRedis = await redis.set(user_id, JSON.stringify({ ...userCreated }));

					if (savedInRedis !== "OK") throw new Error("Failed to save in redis in AuthSignupUseCase");

					if (Bun.env.USE_RABBITMQ === "true") {
						await this.rabbitMq.sendMessageUserSignup(JSON.stringify(userCreated));
						// await this.rabbitMq.consumeMessages();
					}

					return { success: true, data: userCreated };
				}

				return { success: false, error: "User not created" };
			}

			return { success: false, error: "Email already registred" };
		} catch (error: any) {
			return { success: false, error: error.message };
		}
	}
}
