import { afterAll, describe, expect, it } from "bun:test";
import UsersRepository from "../../../repositories/users.repository";
import { app } from "../../../server";
import { faker } from "@faker-js/faker";

describe("...Testing Forget Password Use Case", () => {
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
