import { afterAll, describe, expect, it } from "bun:test";
import { app } from "../../../server";
import { faker } from "@faker-js/faker";
import UsersRepository from "src/repositories/users.repository";

describe("...Testing Reset Password Use Case", () => {
	it("should signup user, forget-password for this user and reset password using token", async () => {
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
							new_password: "newstrongpasswordQWE!123",
							confirm_new_password: "newstrongpasswordQWE!123",
						}),
					},
				),
			)
			.then((res) => res.json());

		expect(responseResetPassword.success).toBeTrue();

		afterAll(async () => {
			await new UsersRepository().delete(responseSignup.data.id);
		});
	});
});
