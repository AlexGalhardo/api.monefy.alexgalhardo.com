import type { Expense } from "@prisma/client";
import TelegramLog from "src/config/telegram-logger.config";
import UsersRepository, { type UsersRepositoryPort } from "src/repositories/users.repository";
import { z } from "zod";
import { ErrorsMessages } from "../../../utils/errors-messages.util";

interface ExpenseGetAllUseCaseResponse {
    success: boolean;
    data?: Expense[];
}

export interface ExpenseGetAllDTO {
    user_email: string;
}

export interface ExpenseGetAllUseCasePort {
    execute(expenseGetAllPayload: ExpenseGetAllDTO): Promise<ExpenseGetAllUseCaseResponse>;
}

export default class ExpenseGetAllUseCase implements ExpenseGetAllUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort = new UsersRepository()) {}

    async execute(expenseGetAllPayload: ExpenseGetAllDTO): Promise<ExpenseGetAllUseCaseResponse> {
        z.object({ user_email: z.string().email() }).parse(expenseGetAllPayload);

        const userExpensesFound = await this.usersRepository.findByEmailAllExpenses(expenseGetAllPayload.user_email);

        if (userExpensesFound) {
            if (Bun.env.USE_TELEGRAM_LOG === "true")
                TelegramLog.info(`\nALL EXPENSES\n\n ${JSON.stringify(userExpensesFound)}\n`);

            return { success: true, data: userExpensesFound };
        }

        throw new Error(ErrorsMessages.EXPENSE_NOT_FOUND);
    }
}
