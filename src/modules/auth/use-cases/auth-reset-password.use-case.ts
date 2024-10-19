import RabbitMQ from "src/config/rabbitmq.config";
import Bcrypt from "src/utils/bcrypt.util";
import AuthResetPasswordValidator from "src/validators/auth-reset-password.validator";
import UsersRepository, { type UsersRepositoryPort } from "../../../repositories/users.repository";
import { ErrorsMessages } from "../../../utils/errors-messages.util";

interface AuthResetPasswordUseCaseResponse {
    success: boolean;
    error?: string;
}

export interface AuthResetPasswordDTO {
    email: string;
    reset_password_token: string;
    new_password: string;
    confirm_new_password: string;
}

export interface AuthResetPasswordCasePort {
    execute(authResetPasswordPayload: AuthResetPasswordDTO): Promise<AuthResetPasswordUseCaseResponse>;
}

export default class AuthResetPasswordUseCase implements AuthResetPasswordCasePort {
    constructor(
        private readonly usersRepository: UsersRepositoryPort = new UsersRepository(),
        private readonly rabbitMq = new RabbitMQ(),
    ) {}

    async execute(authResetPasswordPayload: AuthResetPasswordDTO): Promise<AuthResetPasswordUseCaseResponse> {
        AuthResetPasswordValidator.parse(authResetPasswordPayload);

        const { email, reset_password_token, new_password } = authResetPasswordPayload;

        const userFound = await this.usersRepository.findByEmailAndResetPasswordToken(email, reset_password_token);

        if (userFound) {
            const { reset_password_token_expires_at } = userFound;

            const resetPasswordTokenIsNotExpired = new Date() < new Date(reset_password_token_expires_at as string);

            if (!resetPasswordTokenIsNotExpired) throw new Error(ErrorsMessages.RESET_PASSWORD_TOKEN_EXPIRED);

            const userPasswordUpdated = await this.usersRepository.update({
                email,
                password: await Bcrypt.hash(new_password),
            });

            if (userPasswordUpdated) {
                if (Bun.env.USE_RABBITMQ === "true") {
                    await this.rabbitMq.sendMessageUserSignup(JSON.stringify(userPasswordUpdated));
                    // await this.rabbitMq.consumeMessages();
                }

                return { success: true };
            }

            throw new Error("User password not updated");
        }

        throw new Error(ErrorsMessages.EMAIL_OR_RESET_PASSWORD_TOKEN_INVALID);
    }
}
