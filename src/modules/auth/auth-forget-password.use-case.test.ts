import { afterAll, describe, expect, it } from "bun:test";
import UsersRepository from "../../repositories/users.repository";
import { app } from "../../server";
import { using_database } from "../../utils/constants.util";

describe("...Testing Forget Password Use Case", () => {
    it("should login user", async () => {
        // signup user first
        const user = {
            name: "test Forget password",
            email: "test.forget.password@gmail.com",
            password: "testforgetpasswordQWE!123",
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

        afterAll(async () => {
            await new UsersRepository().delete(responseSignup.data.id);
        });
    });
});
