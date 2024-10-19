import type { Expense, ExpenseCategory } from "@prisma/client";
import TelegramLog from "src/config/telegram-logger.config";
import ExpensesRepository, { type ExpensesRepositoryPort } from "src/repositories/expenses.repository";
import UsersRepository, { type UsersRepositoryPort } from "src/repositories/users.repository";
import ExpenseUpdateValidator from "src/validators/expense-create.validator";
import { ErrorsMessages } from "../../../utils/errors-messages.util";

interface ExpenseCreateUseCaseResponse {
    success: boolean;
    data?: Expense;
}

export interface ExpenseUpdateDTO {
    user_email: string;
    id: string;
    description: string;
    category: ExpenseCategory;
    amount: number;
}

export interface ExpenseUpdateUseCasePort {
    execute(expenseUpdatePayload: ExpenseUpdateDTO): Promise<ExpenseCreateUseCaseResponse>;
}

export default class ExpenseUpdateUseCase implements ExpenseUpdateUseCasePort {
    constructor(
        private readonly expensesRepository: ExpensesRepositoryPort = new ExpensesRepository(),
        private readonly usersRepository: UsersRepositoryPort = new UsersRepository(),
    ) {}

    async execute(expenseUpdatePayload: ExpenseUpdateDTO): Promise<ExpenseCreateUseCaseResponse> {
        ExpenseUpdateValidator.parse(expenseUpdatePayload);

        const { id: expense_id, user_email } = expenseUpdatePayload;

        const userExpenseFoundById = await this.usersRepository.findByEmailExpenseId(user_email, expense_id);

        if (userExpenseFoundById) {
            const expenseUpdated = await this.expensesRepository.update({ ...expenseUpdatePayload });

            if (expenseUpdated) {
                if (Bun.env.USE_TELEGRAM_LOG === "true")
                    TelegramLog.info(`\nEXPENSE UPDATED\n\n ${JSON.stringify(expenseUpdated)}\n`);

                return { success: true, data: expenseUpdated };
            }
        }

        throw new Error(ErrorsMessages.EXPENSE_NOT_FOUND);
    }
}
