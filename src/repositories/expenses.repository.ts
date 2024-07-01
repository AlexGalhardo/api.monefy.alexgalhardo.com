import type { Expense, User } from "@prisma/client";
import { randomUUID } from "node:crypto";
import prisma from "../config/prisma.config";
import { ExpenseCreateDTO } from "src/use-cases/expense-create.use-case";
import { ExpenseUpdateDTO } from "src/use-cases/expense-update.use-case";
import { ErrorsMessages } from "src/utils/errors-messages.util";

export interface ExpensesRepositoryPort {
    findAll(): Promise<Expense[]>;
    findById(id: string): Promise<Expense | null>;
    findByUserEmail(email: string): Promise<Expense | null>;
    create(dto: ExpenseCreateDTO): Promise<Expense>;
    update(dto: ExpenseUpdateDTO): Promise<Expense | null>;
    delete(id: string): Promise<Expense | null>;
}

export default class ExpensesRepository implements ExpensesRepositoryPort {
    async findAll(): Promise<Expense[]> {
        if (Bun.env.USE_JSON_DATABASE === "true") {
            try {
                return await Bun.file("./src/repositories/jsons/expenses.json").json();
            } catch (error: any) {
                throw new Error(error.message);
            }
        } else {
            try {
                return await prisma.expense.findMany({});
            } catch (error: any) {
                throw new Error(error.message);
            }
        }
    }

    async findById(id: string): Promise<Expense | null> {
        if (Bun.env.USE_JSON_DATABASE === "true") {
            try {
                const file = await Bun.file("./src/repositories/jsons/expenses.json").json();

                const expenseFound = file.find((expense: Expense) => expense.id === id);

                if (expenseFound) return expenseFound;

                return null;
            } catch (error: any) {
                throw new Error(error.message);
            }
        } else {
            try {
                return await prisma.expense.findUnique({
                    where: {
                        id,
                    },
                });
            } catch (error: any) {
                throw new Error(error.message);
            }
        }
    }

    async findByUserEmail(email: string): Promise<Expense | null> {
        if (Bun.env.USE_JSON_DATABASE === "true") {
            try {
                const file = await Bun.file("./src/repositories/jsons/expenses.json").json();

                const expenseFound = file.find((expense: Expense) => expense.user_email === email);

                if (expenseFound) return expenseFound;

                return null;
            } catch (error: any) {
                throw new Error(error.message);
            }
        } else {
            try {
                return await prisma.expense.findFirst({
                    where: {
                        user_email: email,
                    },
                });
            } catch (error: any) {
                throw new Error(error.message);
            }
        }
    }

    async create({ user_email, description, category, amount }: ExpenseCreateDTO): Promise<Expense> {
        if (Bun.env.USE_JSON_DATABASE === "true") {
            try {
                const file = await Bun.file("./src/repositories/jsons/expenses.json").json();

                const expense = {
                    id: randomUUID(),
                    user_email,
                    description,
                    category,
                    amount,
                    created_at: new Date().toISOString(),
                    updated_at: null,
                };

                file.push(expense);

                await Bun.write("./src/repositories/jsons/expenses.json", JSON.stringify(file, null, 4));

                return expense;
            } catch (error: any) {
                throw new Error(error.message);
            }
        } else {
            try {
                return await prisma.expense.create({
                    data: {
                        id: randomUUID(),
                        user_email,
                        description,
                        category,
                        amount,
                        created_at: new Date().toISOString(),
                    },
                });
            } catch (error: any) {
                throw new Error(error.message);
            }
        }
    }

    async update({ id, description, category, amount }: ExpenseUpdateDTO): Promise<Expense | null> {
        if (Bun.env.USE_JSON_DATABASE === "true") {
            try {
                const file = await Bun.file("./src/repositories/jsons/expenses.json").json();

                const index = file.findIndex((expense: Expense) => expense.id === id);

                if (index === -1) throw new Error(ErrorsMessages.EXPENSE_NOT_FOUND);

                file[index].description = description;
                file[index].category = category;
                file[index].amount = amount;
                file[index].updated_at = new Date().toISOString();

                await Bun.write("./src/repositories/jsons/expenses.json", JSON.stringify(file, null, 4));

                return file[index];
            } catch (error: any) {
                throw new Error(error.message);
            }
        } else {
            try {
                return await prisma.expense.update({
                    where: {
                        id,
                    },
                    data: {
                        description,
                        category,
                        amount,
                        updated_at: new Date().toISOString(),
                    },
                });
            } catch (error: any) {
                throw new Error(error.message);
            }
        }
    }

    async delete(id: string): Promise<Expense> {
        if (Bun.env.USE_JSON_DATABASE === "true") {
            try {
                const file = await Bun.file("./src/repositories/jsons/expenses.json").json();

                const index = file.findIndex((expense: Expense) => expense.id === id);

                if (index === -1) throw new Error(ErrorsMessages.EXPENSE_NOT_FOUND);

                const expenseDeleted = file.splice(index, 1);

                await Bun.write("./src/repositories/jsons/expenses.json", JSON.stringify(file, null, 4));

                return expenseDeleted;
            } catch (error: any) {
                throw new Error(error.message);
            }
        } else {
            try {
                return await prisma.expense.delete({
                    where: {
                        id,
                    },
                });
            } catch (error: any) {
                throw new Error(error.message);
            }
        }
    }
}
