import { afterAll, describe, expect, it } from "bun:test";
import { app } from "../server";
import { using_database } from "../utils/constants.util";
import UsersRepository from "../repositories/users.repository";
import { faker } from "@faker-js/faker";

describe("...Testing Auth Login Use Case", () => {
    it("should login user", async () => {
        const user = {
            name: faker.string.uuid(),
            email: faker.internet.email(),
            password: "testPasswordQWE!123",
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

        const responseLogin: any = await app
            .handle(
                new Request("http://localhost/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: user.email,
                        password: user.password,
                    }),
                }),
            )
            .then((res) => res.json());

        expect(responseLogin.success).toBeTrue();
        expect(responseLogin.environment).toBe(Bun.env.ENVIRONMENT);
        expect(responseLogin.using_database).toBe(using_database);
        expect(responseLogin.data.name).toBe(user.name);
        expect(responseLogin.data.email).toBe(user.email);
        expect(responseLogin.data.jwt_token).toBeString();

        afterAll(async () => {
            await new UsersRepository().delete(responseLogin.data.id);
        });
    });
});
