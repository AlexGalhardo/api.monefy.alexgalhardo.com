import { afterAll, describe, expect, it } from "bun:test";
import { faker } from "@faker-js/faker";
import UsersRepository from "../../../repositories/users.repository";
import { app } from "../../../server";

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
        expect(responseLogin.data.name).toBe(user.name);
        expect(responseLogin.data.email).toBe(user.email);
        expect(responseLogin.data.jwt_token).toBeString();

        afterAll(async () => {
            await new UsersRepository().delete(responseLogin.data.id);
        });
    });
});
