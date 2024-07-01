import AuthLoginUseCase from "src/use-cases/auth-login.use-case";
import AuthSignupUseCase from "src/use-cases/auth-signup.use-case";
import { using_database } from "src/utils/constants.util";

export default class AuthController {
    static async signup({ body, set }) {
        try {
            const { success, data } = await new AuthSignupUseCase().execute(body);
            if (success === true) return { success: true, environment: Bun.env.ENVIRONMENT, using_database, data };
        } catch (error: any) {
            set.status = 400;
            return {
                success: false,
                environment: Bun.env.ENVIRONMENT,
                using_database,
                message: error.issues ?? error.message,
            };
        }
    }

    static async login({ body, set }) {
        try {
            const { success, data } = await new AuthLoginUseCase().execute(body);
            if (success === true) return { success: true, environment: Bun.env.ENVIRONMENT, using_database, data };
        } catch (error: any) {
            set.status = 400;
            return {
                success: false,
                environment: Bun.env.ENVIROMENT,
                using_database,
                message: error.issues ?? error.message,
            };
        }
    }
}
