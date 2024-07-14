import UsersRepository, { UsersRepositoryPort } from "../repositories/users.repository";
import { ErrorsMessages } from "../utils/errors-messages.util";
import { SMTP } from "src/config/smtp.config";
import RabbitMQ from "src/config/rabbitmq.config";
import AuthResetPasswordValidator from "src/validators/auth-reset-password.validator";

interface AuthResetPasswordUseCaseResponse {
    success: boolean;
    message?: string;
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

        const emailAndResetPasswordTokenIsValid = await this.usersRepository.findByEmailAndResetPasswordToken(
            email,
            reset_password_token,
        );

        if (emailAndResetPasswordTokenIsValid) {
            const userPasswordUpdated = await this.usersRepository.update({
                password: new_password,
            });

            if (userPasswordUpdated) {
                // await this.rabbitMq.sendMessageUserSignup(JSON.stringify(userPasswordUpdated));
                // await this.rabbitMq.consumeMessages();

                return { success: true, message: "Password updated" };
            }

            return { success: false };
        }

        throw new Error(ErrorsMessages.EMAIL_OR_RESET_PASSWORD_TOKEN_INVALID);
    }
}
