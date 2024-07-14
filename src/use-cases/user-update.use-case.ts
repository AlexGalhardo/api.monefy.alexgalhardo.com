import UserUpdateValidator from "src/validators/user-update.validator";
import UsersRepository, { UsersRepositoryPort } from "../repositories/users.repository";
import Bcrypt from "../utils/bcrypt.util";
import { ErrorsMessages } from "../utils/errors-messages.util";
import { User } from "@prisma/client";
import TelegramLog from "src/config/telegram-logger.config";

interface UserUpdateUseCaseResponse {
    success: boolean;
    message?: string;
}

export interface UserUpdateDTO {
    name?: string;
    email: string;
    password?: string;
    reset_password_token?: string;
}

export interface UserUpdateUseCasePort {
    execute(authSignupPayload: UserUpdateDTO): Promise<UserUpdateUseCaseResponse>;
}

export default class UserUpdateUseCase implements UserUpdateUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort = new UsersRepository()) {}

    async execute(userUpdatePayload: UserUpdateDTO): Promise<UserUpdateUseCaseResponse> {
        UserUpdateValidator.parse(userUpdatePayload);

        const { name, email, password, reset_password_token } = userUpdatePayload;

        const userFound = await this.usersRepository.findByEmail(email);

        if (userFound) {
            const userUpdated = await this.usersRepository.update({
                name: name ?? userFound.name,
                password: (await Bcrypt.hash(password as string)) ?? userFound.password,
                reset_password_token,
            });

            if (userUpdated) {
                TelegramLog.info(`\USER UPDATED\n\n ${JSON.stringify(userUpdated)}\n`);

                return { success: true, message: "User updated" };
            }
        }

        throw new Error(ErrorsMessages.EMAIL_OR_PASSWORD_INVALID);
    }
}
