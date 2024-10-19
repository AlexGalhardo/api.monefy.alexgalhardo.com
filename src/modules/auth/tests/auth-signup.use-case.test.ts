import { afterAll, describe, expect, it } from "bun:test";
import { faker } from "@faker-js/faker";
import UsersRepository from "../../../repositories/users.repository";
import { app } from "../../../server";

describe("...Testing Auth Signup Use Case", () => {
	it("should signup user", async () => {
		const user = {
			name: faker.internet.userName(),
			email: faker.internet.email(),
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
		expect(response.data.name).toBe(user.name);
		expect(response.data.email).toBe(user.email);

		afterAll(async () => {
			await new UsersRepository().delete(response.data.id);
		});
	});
});
