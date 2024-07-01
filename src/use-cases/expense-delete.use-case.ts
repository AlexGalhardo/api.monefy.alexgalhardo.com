import { ErrorsMessages } from "../utils/errors-messages.util";
import { Expense } from "@prisma/client";
import TelegramLog from "src/config/telegram-logger.config";
import ExpensesRepository, { ExpensesRepositoryPort } from "src/repositories/expenses.repository";
import UsersRepository, { UsersRepositoryPort } from "src/repositories/users.repository";
import { z } from "zod";

interface ExpenseDeleteUseCaseResponse {
    success: boolean;
    message?: string;
    data?: Expense;
}

export interface ExpenseDeleteDTO {
    id: string;
    user_email: string;
}

export interface ExpenseDeleteUseCasePort {
    execute(expenseDeletePayload: ExpenseDeleteDTO): Promise<ExpenseDeleteUseCaseResponse>;
}

export default class ExpenseDeleteUseCase implements ExpenseDeleteUseCasePort {
    constructor(
        private readonly expensesRepository: ExpensesRepositoryPort = new ExpensesRepository(),
        private readonly usersRepository: UsersRepositoryPort = new UsersRepository(),
    ) {}

    async execute(expenseDeletePayload: ExpenseDeleteDTO): Promise<ExpenseDeleteUseCaseResponse> {
        z.object({ id: z.string().uuid(), user_email: z.string().email() }).parse(expenseDeletePayload);

        const { id: expense_id, user_email } = expenseDeletePayload;

        const userExpenseFoundById = await this.usersRepository.findByEmailExpenseId(user_email, expense_id);

        if (userExpenseFoundById) {
            const expenseDeleted = await this.expensesRepository.delete(expense_id);

            if (expenseDeleted) {
                TelegramLog.info(`\nEXPENSE DELETED\n\n ${JSON.stringify(expenseDeleted)}\n`);

                return { success: true, message: `Expense Id: ${expense_id} deleted`, data: expenseDeleted };
            }
        }

        throw new Error(ErrorsMessages.EXPENSE_NOT_FOUND);
    }
}
