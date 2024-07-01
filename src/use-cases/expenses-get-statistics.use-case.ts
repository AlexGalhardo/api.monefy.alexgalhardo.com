import { ErrorsMessages } from "../utils/errors-messages.util";
import { Expense, ExpenseCategory } from "@prisma/client";
import TelegramLog from "src/config/telegram-logger.config";
import UsersRepository, { UsersRepositoryPort } from "src/repositories/users.repository";
import { z } from "zod";

interface ExpenseGetStatisticsUseCaseResponse {
    success: boolean;
    data?: any;
}

export interface ExpenseGetStatisticsDTO {
    user_email: string;
}

export interface ExpenseGetStatisticsUseCasePort {
    execute(expenseGetStatisticsPayload: ExpenseGetStatisticsDTO): Promise<ExpenseGetStatisticsUseCaseResponse>;
}

export default class ExpenseGetStatisticsUseCase implements ExpenseGetStatisticsUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort = new UsersRepository()) {}

    private categories: ExpenseCategory[] = [
        "FOOD",
        "HOUSE",
        "EDUCATION",
        "SUBSCRIPTIONS",
        "HEALTH",
        "TRANSPORT",
        "ENTERTAINMENT",
        "SHOP",
        "GIFTS",
        "RENT",
        "WORK",
        "GOING_OUT",
        "CLOTHES",
    ];

    private calculateExpenses = (data: Expense[]) => {
        const result: { [key: string]: any } = {
            total_transactions: data.length,
            total_expenses: 0,
        };

        const categoryTotals: { [key in ExpenseCategory]?: number } = {};

        this.categories.forEach((category) => {
            categoryTotals[category] = 0;
        });

        data.forEach((transaction) => {
            result.total_expenses += transaction.amount;
            categoryTotals[transaction.category]! += transaction.amount;
        });

        for (const category in categoryTotals) {
            const total = categoryTotals[category as ExpenseCategory];
            const percentage = ((total! / result.total_expenses) * 100).toFixed(2) + " %";

            result[`total_expenses_${category.toLowerCase()}`] = total;
            result[`total_expenses_${category.toLowerCase()}_percentage`] = percentage;
        }

        return result;
    };

    async execute(expenseGetStatisticsPayload: ExpenseGetStatisticsDTO): Promise<ExpenseGetStatisticsUseCaseResponse> {
        z.object({ user_email: z.string().email() }).parse(expenseGetStatisticsPayload);

        const userExpensesFound = await this.usersRepository.findByEmailAllExpenses(
            expenseGetStatisticsPayload.user_email,
        );

        if (userExpensesFound) {
            TelegramLog.info(
                `\nALL EXPENSES STATISTICS\n\n ${JSON.stringify(this.calculateExpenses(userExpensesFound))}\n`,
            );

            return { success: true, data: this.calculateExpenses(userExpensesFound) };
        }

        throw new Error(ErrorsMessages.EXPENSE_NOT_FOUND);
    }
}
