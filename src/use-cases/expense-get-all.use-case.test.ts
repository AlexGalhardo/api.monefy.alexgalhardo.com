import { afterAll, describe, expect, it } from "bun:test";
import { app } from "../server";
import { using_database } from "../utils/constants.util";
import UsersRepository from "../repositories/users.repository";
import { ExpenseCategory } from "@prisma/client";
import ExpensesRepository from "../repositories/expenses.repository";

describe("...Testing Expense Get All Use Case", () => {
    it("should get all expenses", async () => {
        const user = {
            name: "test signup get all expenses",
            email: "test.signup.get.all.expenses@gmail.com",
            password: "testsignupugetallexpensesQWE!123",
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

        const firstExpense = {
            description: "creating first expense",
            category: ExpenseCategory.SHOP,
            amount: 20000,
        };

        const secondExpense = {
            description: "creating second expense",
            category: ExpenseCategory.FOOD,
            amount: 3990,
        };

        const responseFirstExpenseCreated: any = await app
            .handle(
                new Request(`http://localhost/expenses`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${responseSignup.data.jwt_token}`,
                    },
                    body: JSON.stringify(firstExpense),
                }),
            )
            .then((res) => res.json());

        const responseSecondExpenseCreated: any = await app
            .handle(
                new Request(`http://localhost/expenses`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${responseSignup.data.jwt_token}`,
                    },
                    body: JSON.stringify(secondExpense),
                }),
            )
            .then((res) => res.json());

        expect(responseFirstExpenseCreated.success).toBeTrue();
        expect(responseSecondExpenseCreated.success).toBeTrue();

        const responseExpenseUpdated: any = await app
            .handle(
                new Request(`http://localhost/expenses`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${responseSignup.data.jwt_token}`,
                    },
                }),
            )
            .then((res) => res.json());

        expect(responseExpenseUpdated.success).toBeTrue();
        expect(responseExpenseUpdated.environment).toBe(Bun.env.ENVIRONMENT);
        expect(responseExpenseUpdated.using_database).toBe(using_database);
        expect(responseExpenseUpdated.data.length).toBe(2);

        afterAll(async () => {
            // delete expenses first, then user
            await new ExpensesRepository().delete(responseFirstExpenseCreated.data.id);
            await new ExpensesRepository().delete(responseSecondExpenseCreated.data.id);
            await new UsersRepository().delete(responseSignup.data.id);
        });
    });
});
