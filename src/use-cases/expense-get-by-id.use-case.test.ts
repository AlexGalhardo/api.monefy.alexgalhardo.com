import { afterAll, describe, expect, it } from "bun:test";
import { app } from "../server";
import { using_database } from "../utils/constants.util";
import UsersRepository from "../repositories/users.repository";
import { ExpenseCategory } from "@prisma/client";
import ExpensesRepository from "../repositories/expenses.repository";

describe("...Testing Expense Get By Id Use Case", () => {
    it("should get expense by param id", async () => {
        // signup user first
        const user = {
            name: "test signup get expense by id",
            email: "test.signup.expense.by.id@gmail.com",
            password: "testsignupexpensebyidQWE!123",
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
            description: "creating new expense for get by id test",
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
        const responseGetExpenseById: any = await app
            .handle(
                new Request(`http://localhost/expenses/${responseExpenseCreated.data.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${responseSignup.data.jwt_token}`,
                    },
                }),
            )
            .then((res) => res.json());

        expect(responseGetExpenseById.success).toBeTrue();
        expect(responseGetExpenseById.environment).toBe(Bun.env.ENVIRONMENT);
        expect(responseGetExpenseById.using_database).toBe(using_database);
        expect(responseGetExpenseById.data).toStrictEqual({
            ...responseGetExpenseById.data,
            id: expect.any(String),
            user_email: user.email,
            created_at: expect.any(String),
            updated_at: null,
        });

        afterAll(async () => {
            // delete expense first, then user
            await new ExpensesRepository().delete(responseExpenseCreated.data.id);
            await new UsersRepository().delete(responseSignup.data.id);
        });
    });
});
