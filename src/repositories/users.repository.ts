import type { Expense, User } from "@prisma/client";
import prisma from "../config/prisma.config";
import { ErrorsMessages } from "src/utils/errors-messages.util";

interface UserRepositoryCreateDTO {
    id: string;
    name: string;
    email: string;
    password: string;
    jwt_token: string;
}

interface UserRepositoryUpdateDTO {
    name?: string;
    email: string;
    password?: string;
    reset_password_token?: string;
}

export interface UsersRepositoryPort {
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByEmailAllExpenses(email: string): Promise<Expense[]>;
    findByEmailExpenseId(email: string, expenseId: string): Promise<Expense>;
    create(dto: UserRepositoryCreateDTO): Promise<User>;
    update(dto: UserRepositoryUpdateDTO): Promise<User>;
    delete(id: string): Promise<User>;
    findByEmailAndResetPasswordToken(email: string, reset_password_token: string): Promise<User | null>;
    createResetPasswordToken({ email, reset_password_token, reset_password_token_expires_at }): Promise<User>;
}

export default class UsersRepository implements UsersRepositoryPort {
    async findAll(): Promise<User[]> {
        if (Bun.env.USE_JSON_DATABASE === "true") {
            try {
                return await Bun.file("./src/repositories/jsons/users.json").json();
            } catch (error: any) {
                throw new Error(error.message);
            }
        } else {
            try {
                return await prisma.user.findMany({});
            } catch (error: any) {
                throw new Error(error.message);
            }
        }
    }

    async findById(id: string): Promise<User> {
        if (Bun.env.USE_JSON_DATABASE === "true") {
            try {
                const file = await Bun.file("./src/repositories/jsons/users.json").json();

                const UserFoundById = file.find((User: any) => User.id === id);

                if (UserFoundById) return UserFoundById;

                throw new Error(ErrorsMessages.USER_NOT_FOUND);
            } catch (error: any) {
                throw new Error(error.message);
            }
        } else {
            try {
                const userFound = await prisma.user.findUnique({
                    where: {
                        id,
                    },
                });

                if (userFound) return userFound;

                throw new Error(ErrorsMessages.USER_NOT_FOUND);
            } catch (error: any) {
                throw new Error(error.message);
            }
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        if (Bun.env.USE_JSON_DATABASE === "true") {
            try {
                const file = await Bun.file("./src/repositories/jsons/users.json").json();

                const userFound = file.find((user: User) => user.email === email);

                if (userFound) return userFound;

                return null;
            } catch (error: any) {
                throw new Error(error.message);
            }
        } else {
            try {
                const userFound = await prisma.user.findUnique({
                    where: {
                        email,
                    },
                });

                if (userFound) return userFound;

                return null;
            } catch (error: any) {
                throw new Error(error.message);
            }
        }
    }

    async findByEmailAndResetPasswordToken(email: string, reset_password_token: string): Promise<User | null> {
        if (Bun.env.USE_JSON_DATABASE === "true") {
            try {
                const file = await Bun.file("./src/repositories/jsons/users.json").json();

                const userFound = file.find(
                    (user: User) => user.email === email && user.reset_password_token === reset_password_token,
                );

                if (userFound) return userFound;

                return null;
            } catch (error: any) {
                throw new Error(error.message);
            }
        } else {
            try {
                const userFound = await prisma.user.findUnique({
                    where: {
                        email,
                        reset_password_token,
                    },
                });

                if (userFound) return userFound;

                return null;
            } catch (error: any) {
                throw new Error(error.message);
            }
        }
    }

    async findByEmailAllExpenses(email: string): Promise<Expense[]> {
        if (Bun.env.USE_JSON_DATABASE === "true") {
            try {
                const file = await Bun.file("./src/repositories/jsons/users.json").json();

                const userFound = file.find((user: User) => user.email === email);

                if (userFound) {
                    const file = await Bun.file("./src/repositories/jsons/expenses.json").json();

                    const expensesFound = file.filter((expense: Expense) =>
                        expense.user_email === email ? expense : undefined,
                    );

                    return expensesFound ?? [];
                }

                throw new Error(ErrorsMessages.USER_NOT_FOUND);
            } catch (error: any) {
                throw new Error(error.message);
            }
        } else {
            try {
                const userFound = await prisma.user.findUnique({
                    where: {
                        email,
                    },
                    include: {
                        expenses: true,
                    },
                });

                if (userFound) return userFound.expenses;

                throw new Error(ErrorsMessages.USER_NOT_FOUND);
            } catch (error: any) {
                throw new Error(error.message);
            }
        }
    }

    async findByEmailExpenseId(email: string, expenseId: string): Promise<Expense> {
        if (Bun.env.USE_JSON_DATABASE === "true") {
            try {
                const file = await Bun.file("./src/repositories/jsons/users.json").json();

                const userFound = file.find((user: User) => user.email === email);

                if (userFound) {
                    const file = await Bun.file("./src/repositories/jsons/expenses.json").json();

                    const expensesFound = file.find((expense: Expense) => expense.id === expenseId);

                    if (expensesFound) return expensesFound;

                    throw new Error(ErrorsMessages.EXPENSE_NOT_FOUND);
                }

                throw new Error(ErrorsMessages.USER_NOT_FOUND);
            } catch (error: any) {
                throw new Error(error.message);
            }
        } else {
            try {
                const userFound = await prisma.user.findUnique({
                    where: {
                        email,
                    },
                    include: {
                        expenses: true,
                    },
                });

                if (userFound) {
                    const expenseFound = userFound.expenses.find((expense: Expense) => expense.id === expenseId);
                    if (expenseFound) return expenseFound;

                    throw new Error(ErrorsMessages.EXPENSE_NOT_FOUND);
                }

                throw new Error(ErrorsMessages.USER_NOT_FOUND);
            } catch (error: any) {
                throw new Error(error.message);
            }
        }
    }

    async create({ id, name, email, password, jwt_token }: UserRepositoryCreateDTO): Promise<User> {
        if (Bun.env.USE_JSON_DATABASE === "true") {
            try {
                const file = await Bun.file("./src/repositories/jsons/users.json").json();

                const newUser = {
                    id,
                    name,
                    email,
                    jwt_token,
                    password,
                    reset_password_token: null,
                    reset_password_token_expires_at: null,
                    created_at: new Date().toISOString(),
                    updated_at: null,
                };

                file.push(newUser);

                await Bun.write("./src/repositories/jsons/users.json", JSON.stringify(file, null, 4));

                return newUser;
            } catch (error: any) {
                throw new Error(error.message);
            }
        } else {
            try {
                return await prisma.user.create({
                    data: {
                        id,
                        name,
                        email,
                        password,
                        jwt_token,
                        created_at: new Date().toISOString(),
                    },
                });
            } catch (error: any) {
                throw new Error(error.message);
            }
        }
    }

    async update({ name, email, password, reset_password_token }: UserRepositoryUpdateDTO): Promise<User> {
        if (Bun.env.USE_JSON_DATABASE === "true") {
            try {
                const file = await Bun.file("./src/repositories/jsons/users.json").json();

                const index = file.findIndex((user: User) => user.email === email);

                if (index === -1) throw new Error(ErrorsMessages.USER_NOT_FOUND);

                file[index].name = name ?? file[index].name;

                if (password) {
                    file[index].password = password ?? file[index].password;
                    file[index].reset_password_token = null;
                    file[index].reset_password_token_expires_at = null;
                }

                file[index].updated_at = new Date().toISOString();

                await Bun.write("./src/repositories/jsons/users.json", JSON.stringify(file, null, 4));

                return file[index];
            } catch (error: any) {
                throw new Error(error.message);
            }
        } else {
            try {
                const user = await prisma.user.findUnique({
                    where: { email },
                });

                let userName = name ?? user?.name;
                let newPassword = password ?? user?.password;
                let resetPasswordToken = reset_password_token ?? user?.reset_password_token;

                return await prisma.user.update({
                    where: {
                        email,
                    },
                    data: {
                        name: userName,
                        password: newPassword,
                        reset_password_token: resetPasswordToken,
                        reset_password_token_expires_at: reset_password_token
                            ? null
                            : user?.reset_password_token_expires_at,
                        updated_at: new Date().toISOString(),
                    },
                });
            } catch (error: any) {
                throw new Error(error.message);
            }
        }
    }

    async delete(id: string): Promise<User> {
        if (Bun.env.USE_JSON_DATABASE === "true") {
            try {
                const file = await Bun.file("./src/repositories/jsons/users.json").json();

                const index = file.findIndex((User: any) => User.id === id);

                if (index === -1) throw new Error(ErrorsMessages.USER_NOT_FOUND);

                const userDeleted = file.splice(index, 1);

                await Bun.write("./src/repositories/jsons/users.json", JSON.stringify(file, null, 4));

                return userDeleted;
            } catch (error: any) {
                throw new Error(`Error deleting User: ${error.message}`);
            }
        } else {
            try {
                return await prisma.user.delete({
                    where: {
                        id,
                    },
                });
            } catch (error: any) {
                throw new Error(error.message);
            }
        }
    }

    async createResetPasswordToken({ email, reset_password_token, reset_password_token_expires_at }): Promise<User> {
        if (Bun.env.USE_JSON_DATABASE === "true") {
            try {
                const file = await Bun.file("./src/repositories/jsons/users.json").json();

                const index = file.findIndex((user: User) => user.email === email);

                if (index === -1) throw new Error(ErrorsMessages.USER_NOT_FOUND);

                file[index].reset_password_token = reset_password_token;
                file[index].reset_password_token_expires_at = reset_password_token_expires_at;
                file[index].updated_at = new Date().toISOString();

                await Bun.write("./src/repositories/jsons/users.json", JSON.stringify(file, null, 4));

                return file[index];
            } catch (error: any) {
                throw new Error(`Error updating User: ${error.message}`);
            }
        } else {
            try {
                return await prisma.user.update({
                    where: {
                        email,
                    },
                    data: {
                        reset_password_token,
                        reset_password_token_expires_at,
                        updated_at: new Date().toISOString(),
                    },
                });
            } catch (error: any) {
                throw new Error(error.message);
            }
        }
    }
}
