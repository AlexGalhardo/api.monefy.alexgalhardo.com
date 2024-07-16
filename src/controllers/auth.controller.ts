import AuthForgetPasswordUseCase from "src/use-cases/auth-forget-password.use-case";
import AuthLoginUseCase from "src/use-cases/auth-login.use-case";
import AuthResetPasswordUseCase from "src/use-cases/auth-reset-password.use-case";
import AuthSignupUseCase from "src/use-cases/auth-signup.use-case";
import { using_database } from "src/utils/constants.util";

export default class AuthController {
    static async signup({ body, set }) {
        try {
            const { success, data, error } = await new AuthSignupUseCase().execute(body);
            if (success === true) return { success: true, environment: Bun.env.ENVIRONMENT, using_database, data };
            return { success: false, environment: Bun.env.ENVIRONMENT, using_database, error };
        } catch (error: any) {
            set.status = 400;
            return {
                success: false,
                environment: Bun.env.ENVIRONMENT,
                using_database,
                error: error.issues ?? error.message,
            };
        }
    }

    static async login({ body, set }) {
        try {
            const { success, data, error } = await new AuthLoginUseCase().execute(body);
            if (success === true) return { success: true, environment: Bun.env.ENVIRONMENT, using_database, data };
            set.status = 400;
            return { success: false, error };
        } catch (error: any) {
            set.status = 400;
            return {
                success: false,
                environment: Bun.env.ENVIROMENT,
                using_database,
                error: error.issues ?? error.message,
            };
        }
    }

    static async forgetPassword({ body, set }) {
        try {
            const { success, data, error } = await new AuthForgetPasswordUseCase().execute({ email: body.email });
            if (success === true) return { success: true, environment: Bun.env.ENVIRONMENT, using_database, data };
            set.status = 400;
            return { success: false, error };
        } catch (error: any) {
            set.status = 400;
            return {
                success: false,
                environment: Bun.env.ENVIRONMENT,
                using_database,
                error: error.issues ?? error.message,
            };
        }
    }

    static async resetPassword({ params, body, set }) {
        try {
            const { success, error } = await new AuthResetPasswordUseCase().execute({
                email: params.email,
                reset_password_token: params.token,
                new_password: body.new_password,
                confirm_new_password: body.confirm_new_password,
            });
            if (success === true) return { success: true, environment: Bun.env.ENVIRONMENT, using_database };
            return { success: false, error };
        } catch (error: any) {
            set.status = 400;
            return {
                success: false,
                environment: Bun.env.ENVIRONMENT,
                using_database,
                error: error.issues ?? error.message,
            };
        }
    }
}
