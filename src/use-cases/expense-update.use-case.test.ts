import { afterAll, describe, expect, it } from "bun:test";
import { app } from "../server";
import { using_database } from "../utils/constants.util";
import UsersRepository from "../repositories/users.repository";
import { ExpenseCategory } from "@prisma/client";
import ExpensesRepository from "../repositories/expenses.repository";

describe("...Testing Expense Update Use Case", () => {
    it("should update expense by param id", async () => {
        // signup user first
        const user = {
            name: "test signup update expense",
            email: "test.signup.update.expense@gmail.com",
            password: "testsignupupdateexpenseQWE!123",
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
        expect(responseSignup.environment).toBe(Bun.env.ENVIRONMENT);
        expect(responseSignup.using_database).toBe(using_database);
        expect(responseSignup.data.name).toBe(user.name);
        expect(responseSignup.data.email).toBe(user.email);
        expect(responseSignup.data.jwt_token).toBeString();

        // now create new expense using this user as owner
        const expense = {
            description: "creating new expense for update test",
            category: ExpenseCategory.SHOP,
            amount: 20000,
        };

        const responseExpenseCreated: any = await app
            .handle(
                new Request(`http://localhost/expenses`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${responseSignup.data.jwt_token}`,
                    },
                    body: JSON.stringify(expense),
                }),
            )
            .then((res) => res.json());

        expect(responseExpenseCreated.success).toBeTrue();
        expect(responseExpenseCreated.environment).toBe(Bun.env.ENVIRONMENT);
        expect(responseExpenseCreated.using_database).toBe(using_database);
        expect(responseExpenseCreated.data).toStrictEqual({
            ...responseExpenseCreated.data,
            id: expect.any(String),
            user_email: user.email,
            created_at: expect.any(String),
            updated_at: null,
        });

        // now get this expense created by its id
        const responseExpenseUpdated: any = await app
            .handle(
                new Request(`http://localhost/expenses/${responseExpenseCreated.data.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${responseSignup.data.jwt_token}`,
                    },
                    body: JSON.stringify({
                        description: "upadating expense description for update test",
                        category: ExpenseCategory.FOOD,
                        amount: 3990,
                    }),
                }),
            )
            .then((res) => res.json());

        expect(responseExpenseUpdated.success).toBeTrue();
        expect(responseExpenseUpdated.environment).toBe(Bun.env.ENVIRONMENT);
        expect(responseExpenseUpdated.using_database).toBe(using_database);
        expect(responseExpenseUpdated.data).toStrictEqual({
            ...responseExpenseUpdated.data,
            id: responseExpenseCreated.data.id,
            user_email: user.email,
            created_at: expect.any(String),
            updated_at: expect.any(String),
        });

        afterAll(async () => {
            // delete expense first, then user
            await new ExpensesRepository().delete(responseExpenseCreated.data.id);
            await new UsersRepository().delete(responseSignup.data.id);
        });
    });
});
