import { afterAll, describe, expect, it } from "bun:test";
import { ExpenseCategory } from "@prisma/client";
import ExpensesRepository from "../../../repositories/expenses.repository";
import UsersRepository from "../../../repositories/users.repository";
import { app } from "../../../server";
import { faker } from "@faker-js/faker";

describe("...Testing Expense Create Use case", () => {
    it("should create expense using user jwt token", async () => {
        const user = {
            name: faker.internet.userName(),
            email: faker.internet.email(),
            password: "testsignupQWE!123",
        };

        const responseSignup: any = await app
            .handle(
                new Request("http://localhost/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(user),
                }),
            )
            .then((res) => res.json());

        expect(responseSignup.success).toBeTrue();
        expect(responseSignup.data.name).toBe(user.name);
        expect(responseSignup.data.email).toBe(user.email);
        expect(responseSignup.data.jwt_token).toBeString();

        const expense = {
            description: "creating new expense test",
            category: ExpenseCategory.SHOP,
            amount: 20000,
        };

        const responseCreateExpense: any = await app
            .handle(
                new Request("http://localhost/expenses", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${responseSignup.data.jwt_token}`,
                    },
                    body: JSON.stringify(expense),
                }),
            )
            .then((res) => res.json());

        expect(responseCreateExpense.success).toBeTrue();
        expect(responseCreateExpense.data).toStrictEqual({
            ...responseCreateExpense.data,
            id: expect.any(String),
            user_email: user.email,
            created_at: expect.any(String),
            updated_at: expect.any(String),
        });

        afterAll(async () => {
            await new ExpensesRepository().delete(responseCreateExpense.data.id);
            await new UsersRepository().delete(responseSignup.data.id);
        });
    });
});
