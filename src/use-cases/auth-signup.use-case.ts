import { randomUUID } from "node:crypto";
import UsersRepository, { UsersRepositoryPort } from "../repositories/users.repository";
import Bcrypt from "../utils/bcrypt.util";
import { ErrorsMessages } from "../utils/errors-messages.util";
import * as jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import AuthSignupValidator from "src/validators/auth-signup.validator";
import { SMTP } from "src/config/smtp.config";
import RabbitMQ from "src/config/rabbitmq.config";

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
                if (Bun.env.USE_RABBITMQ === "true") {
                    await this.rabbitMq.sendMessageUserSignup(JSON.stringify(userCreated));
                    await this.rabbitMq.consumeMessages();
                }

                return { success: true, data: userCreated };
            }

            throw new Error(ErrorsMessages.EMAIL_OR_PASSWORD_INVALID);
        }

        throw new Error(ErrorsMessages.EMAIL_OR_PASSWORD_INVALID);
    }
}
