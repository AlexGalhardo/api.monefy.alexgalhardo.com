import { afterAll, describe, expect, it } from "bun:test";
import { app } from "../server";
import { using_database } from "../utils/constants.util";
import UsersRepository from "../repositories/users.repository";
import { ExpenseCategory } from "@prisma/client";

describe("...Testing Expense Delete Use Case", () => {
    it("should delete expense using user owner jwt token", async () => {
        // signup user first
        const user = {
            name: "deletetest",
            email: "deletetest@gmail.com",
            password: "deletetestQWE!123",
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
            description: "creating new expense for delete test",
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

        // now delete this expense created by its id
        const responseExpenseDeleted: any = await app
            .handle(
                new Request(`http://localhost/expenses/${responseExpenseCreated.data.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${responseSignup.data.jwt_token}`,
                    },
                }),
            )
            .then((res) => res.json());

        expect(responseExpenseDeleted.success).toBeTrue();
        expect(responseExpenseDeleted.environment).toBe(Bun.env.ENVIRONMENT);
        expect(responseExpenseDeleted.using_database).toBe(using_database);

        afterAll(async () => {
            // delete expense first, then user
            await new UsersRepository().delete(responseSignup.data.id);
        });
    });
});
