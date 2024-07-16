import UsersRepository, { UsersRepositoryPort } from "../repositories/users.repository";
import Bcrypt from "../utils/bcrypt.util";
import { ErrorsMessages } from "../utils/errors-messages.util";
import * as jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import AuthLoginValidator from "src/validators/auth-login.validator";

interface AuthLoginUseCaseResponse {
    success: boolean;
    data?: User;
    message?: string;
    error?: string;
}

export interface AuthLoginDTO {
    email: string;
    password: string;
}

export interface AuthLoginUseCasePort {
    execute(authLoginPayload: AuthLoginDTO): Promise<AuthLoginUseCaseResponse>;
}

export default class AuthLoginUseCase implements AuthLoginUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort = new UsersRepository()) {}

    async execute(authLoginPayload: AuthLoginDTO): Promise<AuthLoginUseCaseResponse> {
        AuthLoginValidator.parse(authLoginPayload);

        const { email, password } = authLoginPayload;

        const userFound = await this.usersRepository.findByEmail(email);

        if (userFound) {
            const passwordIsCorrect = await Bcrypt.compare(password, userFound.password);

            if (!passwordIsCorrect) return { success: false, error: ErrorsMessages.EMAIL_OR_PASSWORD_INVALID };

            const jwt_token = jwt.sign({ user_email: userFound.email }, Bun.env.JWT_SECRET as string);

            userFound.jwt_token = jwt_token;

            const userJwtTokenUpdated = await this.usersRepository.update(userFound);

            if (userJwtTokenUpdated) return { success: true, data: userFound };

            throw new Error(ErrorsMessages.EMAIL_OR_PASSWORD_INVALID);
        }

        throw new Error(ErrorsMessages.EMAIL_OR_PASSWORD_INVALID);
    }
}
