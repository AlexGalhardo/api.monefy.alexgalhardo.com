import UsersRepository, { UsersRepositoryPort } from "../repositories/users.repository";
import { ErrorsMessages } from "../utils/errors-messages.util";
import { Expense, ExpenseCategory } from "@prisma/client";
import TelegramLog from "src/config/telegram-logger.config";
import ExpensesRepository, { ExpensesRepositoryPort } from "src/repositories/expenses.repository";
import ExpenseCreateValidator from "src/validators/expense-create.validator";

interface ExpenseCreateUseCaseResponse {
    success: boolean;
    data?: Expense;
}

export interface ExpenseCreateDTO {
    user_email: string;
    description: string;
    category: ExpenseCategory;
    amount: number;
}

export interface ExpenseCreateUseCasePort {
    execute(expenseCreatePayload: ExpenseCreateDTO): Promise<ExpenseCreateUseCaseResponse>;
}

export default class ExpenseCreateUseCase implements ExpenseCreateUseCasePort {
    constructor(
        private readonly usersRepository: UsersRepositoryPort = new UsersRepository(),
        private readonly expensesRepository: ExpensesRepositoryPort = new ExpensesRepository(),
    ) {}

    async execute(expenseCreatePayload: ExpenseCreateDTO): Promise<ExpenseCreateUseCaseResponse> {
        ExpenseCreateValidator.parse(expenseCreatePayload);

        const userFound = await this.usersRepository.findByEmail(expenseCreatePayload.user_email);

        if (userFound) {
            const expenseCreated = await this.expensesRepository.create({ ...expenseCreatePayload });

            if (expenseCreated) {
                TelegramLog.info(`\nEXPENSE CREATED\n\n ${JSON.stringify(expenseCreated)}\n`);

                return { success: true, data: expenseCreated };
            }
        }

        throw new Error(ErrorsMessages.USER_NOT_FOUND);
    }
}
