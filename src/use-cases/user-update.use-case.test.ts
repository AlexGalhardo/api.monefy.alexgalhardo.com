import { afterAll, describe, expect, it } from "bun:test";
import { app } from "../server";
import { using_database } from "../utils/constants.util";
import UsersRepository from "../repositories/users.repository";

describe("...Testing User Update Use Case", () => {
    it("should signup user and update its name and password", async () => {
        const user = {
            name: "test update user",
            email: "test.update.user@gmail.com",
            password: "testupdateuserQWE!123",
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

        const responseUpdateUser: any = await app
            .handle(
                new Request("http://localhost/user", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: "User name updated",
                        password: "newPassword",
                    }),
                }),
            )
            .then((res) => res.json());

        expect(responseUpdateUser.success).toBeTrue();
        expect(responseUpdateUser.message).toBe("User updated");

        afterAll(async () => {
            await new UsersRepository().delete(response.data.id);
        });
    });
});
