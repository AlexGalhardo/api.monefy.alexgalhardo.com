import { afterAll, describe, expect, it } from "bun:test";
import { faker } from "@faker-js/faker";
import UsersRepository from "../../repositories/users.repository";
import { app } from "../../server";

describe("...Testing User Update Use Case", () => {
    it("should signup user and update its name and password", async () => {
        const user = {
            name: faker.string.uuid(),
            email: faker.internet.email(),
            password: "testPasswordQWE!123",
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
        expect(response.data.name).toBe(user.name);
        expect(response.data.email).toBe(user.email);

        const responseUpdateUser: any = await app
            .handle(
                new Request("http://localhost/user", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${response.data.jwt_token}`,
                    },
                    body: JSON.stringify({
                        name: "User name updated",
                        email: user.email,
                        password: "newPasswordQWE!123",
                    }),
                }),
            )
            .then((res) => res.json());

        expect(responseUpdateUser.success).toBeTrue();
        expect(responseUpdateUser.data.name).toBe("User name updated");

        afterAll(async () => {
            await new UsersRepository().delete(response.data.id);
        });
    });
});
