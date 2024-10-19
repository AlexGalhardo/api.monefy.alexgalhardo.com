import type { User } from "@prisma/client";
import TelegramLog from "src/config/telegram-logger.config";
import { UserUpdateValidator } from "src/validators/user-update.validator";
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
		try {
			UserUpdateValidator.parse(userUpdatePayload);

			const userFound = await this.usersRepository.findByEmail(userUpdatePayload.email);

			if (userFound) {
				const userUpdated = await this.usersRepository.update({
					...userUpdatePayload,
				});

				if (userUpdated) {
					if (Bun.env.USE_TELEGRAM_LOG === "true")
						TelegramLog.info(`\USER UPDATED\n\n ${JSON.stringify(userUpdated)}\n`);

					return { success: true, data: userUpdated };
				}
			}

			throw new Error(ErrorsMessages.USER_NOT_FOUND);
		} catch (error: any) {
			throw new Error(error.message);
		}
	}
}
