import { afterAll, describe, expect, it } from "bun:test";
import { app } from "../server";
import { using_database } from "../utils/constants.util";
import UsersRepository from "../repositories/users.repository";

describe("...Testing Auth Signup Use Case", () => {
    it("should signup user", async () => {
        const user = {
            name: "test signup",
            email: "test.signup@gmail.com",
            password: "testsignupQWE!123",
        };

        const response: any = await app
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

        expect(response.success).toBeTrue();
        expect(response.environment).toBe(Bun.env.ENVIRONMENT);
        expect(response.using_database).toBe(using_database);
        expect(response.data.name).toBe(user.name);
        expect(response.data.email).toBe(user.email);

        afterAll(async () => {
            await new UsersRepository().delete(response.data.id);
        });
    });
});
