import type { User } from "@prisma/client";
import TelegramLog from "src/config/telegram-logger.config";
import UserUpdateValidator from "src/validators/user-update.validator";
import UsersRepository, { type UsersRepositoryPort } from "../../../repositories/users.repository";
import Bcrypt from "../../../utils/bcrypt.util";
import { ErrorsMessages } from "../../../utils/errors-messages.util";

interface UserUpdateUseCaseResponse {
    success: boolean;
    error?: string;
    data?: User;
}

export interface UserUpdateUseCaseDTO {
    name?: string;
    email: string;
    password?: string;
    reset_password_token?: string;
}

export interface UserUpdateUseCasePort {
    execute(authSignupPayload: UserUpdateUseCaseDTO): Promise<UserUpdateUseCaseResponse>;
}

export default class UserUpdateUseCase implements UserUpdateUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort = new UsersRepository()) {}

    async execute(userUpdatePayload: UserUpdateUseCaseDTO): Promise<UserUpdateUseCaseResponse> {
        UserUpdateValidator.parse(userUpdatePayload);

        const { name, email, password, reset_password_token } = userUpdatePayload;

        const userFound = await this.usersRepository.findByEmail(email);

        if (userFound) {
            const userUpdated = await this.usersRepository.update({
                name: name ?? userFound.name,
                email,
                password: password ? await Bcrypt.hash(password as string) : userFound.password,
                reset_password_token: String(reset_password_token) ?? userFound.reset_password_token,
            });

            if (userUpdated) {
                if (Bun.env.USE_TELEGRAM_LOG === "true")
                    TelegramLog.info(`\USER UPDATED\n\n ${JSON.stringify(userUpdated)}\n`);

                return { success: true, data: userUpdated };
            }
        }

        throw new Error(ErrorsMessages.HEADER_AUTHORIZATION_BEARER_TOKEN_INVALID);
    }
}
