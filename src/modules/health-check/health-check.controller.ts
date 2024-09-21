import { using_database } from "src/utils/constants.util";

export default class HealthCheckController {
    static async index() {
        return {
            success: true,
            message: "API is On, lets gooo!",
            environment: Bun.env.ENVIRONMENT,
            using_database,
        };
    }
}
