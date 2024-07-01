import { UsersRepositoryPort } from "../repositories/users.repository";
import Bcrypt from "../utils/bcrypt.util";
import { ErrorsMessages } from "../utils/errors-messages.util";
import EmailValidator from "../validators/email.validator";
import PasswordValidator from "../validators/password.validator";
import UsernameValidator from "src/validators/user-name.validator";
import { User } from "@prisma/client";
import TelegramLog from "src/config/telegram-logger.config";

interface ProfileUpdateUseCaseResponse {
    success: boolean;
    data?: User;
}

export interface ProfileUpdateDTO {
    id: string;
    name?: string;
    email?: string;
    password?: string;
    jwt_token?: string;
}

export interface ProfileUpdateUseCasePort {
    execute(authSignupPayload: ProfileUpdateDTO): Promise<ProfileUpdateUseCaseResponse>;
}

export default class ProfileUpdateUseCase implements ProfileUpdateUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort) {}

    async execute(profileUpdatePayload: ProfileUpdateDTO): Promise<ProfileUpdateUseCaseResponse> {
        let hashedPassword: string | null = null;

        if (profileUpdatePayload.name && !UsernameValidator.validate(profileUpdatePayload.name))
            throw new Error(ErrorsMessages.USERNAME_INVALID);

        if (profileUpdatePayload.email && !EmailValidator.validate(profileUpdatePayload.email))
            throw new Error(ErrorsMessages.EMAIL_INVALID);

        if (profileUpdatePayload.password && !PasswordValidator.validate(profileUpdatePayload.password)) {
            throw new Error(ErrorsMessages.PASSWORD_INSECURE);
        } else {
            hashedPassword = await Bcrypt.hash(profileUpdatePayload.password as string);
        }

        const userFound = await this.usersRepository.findById(profileUpdatePayload.id);

        if (userFound) {
            const userUpdated = await this.usersRepository.update({
                id: profileUpdatePayload.id,
                name: profileUpdatePayload.name ?? userFound.name,
                email: profileUpdatePayload.email ?? userFound.email,
                password: hashedPassword ?? userFound.password,
                jwt_token: profileUpdatePayload.jwt_token ?? userFound.jwt_token,
                reset_password_token: userFound.reset_password_token,
                reset_password_token_expires_at: userFound.reset_password_token_expires_at,
                created_at: userFound.created_at,
                updated_at: new Date().toISOString(),
            });

            if (userUpdated) {
                TelegramLog.info(`\USER UPDATED\n\n ${JSON.stringify(userUpdated)}\n`);

                return { success: true, data: userUpdated };
            }
        }

        throw new Error(ErrorsMessages.EMAIL_OR_PASSWORD_INVALID);
    }
}
