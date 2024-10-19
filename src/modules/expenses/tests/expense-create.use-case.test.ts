import { afterAll, describe, expect, it } from "bun:test";
import { ExpenseCategory } from "@prisma/client";
import ExpensesRepository from "../../../repositories/expenses.repository";
import UsersRepository from "../../../repositories/users.repository";
import { app } from "../../../server";

describe("...Testing Expense Create Use case", () => {
    it("should create expense using user jwt token", async () => {
        const user = {
            name: "test signup create expense",
            email: "test.signup.create.expense@gmail.com",
            password: "testsignupcreateexpenseQWE!123",
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

        const response: any = await app
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

        expect(response.success).toBeTrue();
        expect(response.data).toStrictEqual({
            ...response.data,
            id: expect.any(String),
            user_email: user.email,
            created_at: expect.any(String),
            updated_at: null,
        });

        afterAll(async () => {
            await new ExpensesRepository().delete(response.data.id);
            await new UsersRepository().delete(responseSignup.data.id);
        });
    });
});
