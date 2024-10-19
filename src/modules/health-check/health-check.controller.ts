import { using_database } from "src/utils/constants.util";

export default class HealthCheckController {
	static async index() {
		return {
			success: true,
			message: "API is on, lets gooo!",
			environment: Bun.env.NODE_ENV,
			database: using_database,
		};
	}
}
