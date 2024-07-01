import { ErrorsMessages } from "../utils/errors-messages.util";
import { Expense } from "@prisma/client";
import TelegramLog from "src/config/telegram-logger.config";
import UsersRepository, { UsersRepositoryPort } from "src/repositories/users.repository";
import { z } from "zod";

interface ExpenseGetByIdUseCaseResponse {
    success: boolean;
    data?: Expense;
}

export interface ExpenseGetByIdDTO {
    id: string;
    user_email: string;
}

export interface ExpenseGetByIdUseCasePort {
    execute(ExpenseDeletePayload: ExpenseGetByIdDTO): Promise<ExpenseGetByIdUseCaseResponse>;
}

export default class ExpenseGetByIdUseCase implements ExpenseGetByIdUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort = new UsersRepository()) {}

    async execute(expenseGetByIdPayload: ExpenseGetByIdDTO): Promise<ExpenseGetByIdUseCaseResponse> {
        z.object({ id: z.string().uuid(), user_email: z.string().email() }).parse(expenseGetByIdPayload);

        const { id: expense_id, user_email } = expenseGetByIdPayload;

        const userExpenseFoundById = await this.usersRepository.findByEmailExpenseId(user_email, expense_id);

        if (userExpenseFoundById) {
            TelegramLog.info(`\nEXPENSE FOUND BY ID\n\n ${JSON.stringify(userExpenseFoundById)}\n`);

            return { success: true, data: userExpenseFoundById };
        }

        throw new Error(ErrorsMessages.EXPENSE_NOT_FOUND);
    }
}
