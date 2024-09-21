import RabbitMQ from "src/config/rabbitmq.config";
import generateRandomToken from "src/utils/generate-random-token.util";
import AuthForgetPasswordValidator from "src/validators/auth-forget-password.validator";
import UsersRepository, { type UsersRepositoryPort } from "../../repositories/users.repository";

interface AuthForgetPasswordUseCaseResponse {
    success: boolean;
    data?: {
        reset_password_token: string;
    };
    error?: string;
}

export interface AuthForgetPasswordDTO {
    email: string;
}

export interface AuthForgetPasswordCasePort {
    execute(authForgetPasswordPayload: AuthForgetPasswordDTO): Promise<AuthForgetPasswordUseCaseResponse>;
}

export default class AuthForgetPasswordUseCase implements AuthForgetPasswordCasePort {
    constructor(
        private readonly usersRepository: UsersRepositoryPort = new UsersRepository(),
        private readonly rabbitMq = new RabbitMQ(),
    ) {}

    async execute(authForgetPasswordPayload: AuthForgetPasswordDTO): Promise<AuthForgetPasswordUseCaseResponse> {
        AuthForgetPasswordValidator.parse(authForgetPasswordPayload);

        const { email } = authForgetPasswordPayload;

        const emailRegistred = await this.usersRepository.findByEmail(email);

        if (emailRegistred) {
            const token = generateRandomToken();

            const linkToResetPassword = `${Bun.env.APP_URL}/reset-password/${email}/${token}`;

            const resetPasswordTokenExpiresInOneHour = new Date(new Date().getTime() + 60 * 60 * 1000).toISOString();

            const resetPasswordTokenCreated = await this.usersRepository.createResetPasswordToken({
                email: authForgetPasswordPayload.email,
                reset_password_token: token,
                reset_password_token_expires_at: resetPasswordTokenExpiresInOneHour,
            });

            if (resetPasswordTokenCreated) {
                if (Bun.env.USE_RABBITMQ === "true") {
                    await this.rabbitMq.sendMessageForgetPassword(JSON.stringify({ email, linkToResetPassword }));
                    // await this.rabbitMq.consumeMessages();
                }

                return { success: true, data: { reset_password_token: token } };
            }

            throw new Error("Reset Password Token not created");
        }

        throw new Error("Email not found");
    }
}
