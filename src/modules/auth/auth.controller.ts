import AuthForgetPasswordUseCase from "src/modules/auth/auth-forget-password.use-case";
import AuthLoginUseCase from "src/modules/auth/auth-login.use-case";
import AuthResetPasswordUseCase from "src/modules/auth/auth-reset-password.use-case";
import AuthSignupUseCase from "src/modules/auth/auth-signup.use-case";
import { using_database } from "src/utils/constants.util";

export default class AuthController {
    static async signup({ body, set }) {
        try {
            const { success, ...rest } = await new AuthSignupUseCase().execute(body);
            return { success, ...rest };
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
            const { success, ...rest } = await new AuthLoginUseCase().execute(body);
            return { success, ...rest };
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
            const { success, ...rest } = await new AuthForgetPasswordUseCase().execute({ email: body.email });
            return { success, ...rest };
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
            const { success, ...rest } = await new AuthResetPasswordUseCase().execute({
                email: params.email,
                reset_password_token: params.token,
                new_password: body.new_password,
                confirm_new_password: body.confirm_new_password,
            });
            return { success, ...rest };
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
