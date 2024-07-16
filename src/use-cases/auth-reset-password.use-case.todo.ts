import { afterAll, describe, expect, it } from "bun:test";
import { app } from "../server";
import { using_database } from "../utils/constants.util";
import UsersRepository from "../repositories/users.repository";

describe("...Testing Reset Password Use Case", () => {
    it("should signup user, forget-password for this user and reset password using token", async () => {
        // signup user first
        const user = {
            name: "test reset password",
            email: "test.reset.password@gmail.com",
            password: "testresetpasswordQWE!123",
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

        const responseForgetPassword: any = await app
            .handle(
                new Request("http://localhost/forget-password", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: user.email,
                    }),
                }),
            )
            .then((res) => res.json());

        expect(responseForgetPassword.success).toBeTrue();
        expect(responseForgetPassword.environment).toBe(Bun.env.ENVIRONMENT);
        expect(responseForgetPassword.using_database).toBe(using_database);
        expect(responseForgetPassword.data.reset_password_token).toBeDefined();

        const responseResetPassword: any = await app
            .handle(
                new Request(
                    `http://localhost/reset-password/${user.email}/${responseForgetPassword.data.reset_password_token}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            new_password: "new password",
                            confirm_new_password: "confirm new password",
                        }),
                    },
                ),
            )
            .then((res) => res.json());

        expect(responseResetPassword.success).toBeTrue();
        expect(responseResetPassword.environment).toBe(Bun.env.ENVIRONMENT);
        expect(responseResetPassword.using_database).toBe(using_database);

        afterAll(async () => {
            await new UsersRepository().delete(responseSignup.data.id);
        });
    });
});
