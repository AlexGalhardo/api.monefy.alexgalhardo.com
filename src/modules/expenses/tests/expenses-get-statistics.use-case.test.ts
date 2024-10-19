import { afterAll, describe, expect, it } from "bun:test";
import { ExpenseCategory } from "@prisma/client";
import ExpensesRepository from "../../../repositories/expenses.repository";
import UsersRepository from "../../../repositories/users.repository";
import { app } from "../../../server";
import { faker } from "@faker-js/faker";

describe("...Testing Expense Get Statistics Use Case", () => {
    it("should get all expenses", async () => {
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

        const firstExpense = {
            description: "creating first expense",
            category: ExpenseCategory.SHOP,
            amount: 60000,
        };

        const secondExpense = {
            description: "creating second expense",
            category: ExpenseCategory.FOOD,
            amount: 40000,
        };

        const responseFirstExpenseCreated: any = await app
            .handle(
                new Request("http://localhost/expenses", {
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
                new Request("http://localhost/expenses", {
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

        const responseGetStatistics: any = await app
            .handle(
                new Request("http://localhost/expenses/statistics", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${responseSignup.data.jwt_token}`,
                    },
                }),
            )
            .then((res) => res.json());

        expect(responseGetStatistics.success).toBeTrue();
        expect(responseGetStatistics.data.total_transactions).toBe(2);
        expect(responseGetStatistics.data.total_expenses).toBe(100000);
        expect(responseGetStatistics.data.total_expenses_food).toBe(40000);
        expect(responseGetStatistics.data.total_expenses_food_percentage).toBe("40.00 %");
        expect(responseGetStatistics.data.total_expenses_shop).toBe(60000);
        expect(responseGetStatistics.data.total_expenses_shop_percentage).toBe("60.00 %");

        afterAll(async () => {
            await new ExpensesRepository().delete(responseFirstExpenseCreated.data.id);
            await new ExpensesRepository().delete(responseSecondExpenseCreated.data.id);
            await new UsersRepository().delete(responseSignup.data.id);
        });
    });
});
