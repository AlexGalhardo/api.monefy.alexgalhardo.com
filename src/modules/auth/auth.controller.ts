import AuthForgetPasswordUseCase from "./use-cases/auth-forget-password.use-case";
import AuthLoginUseCase from "./use-cases/auth-login.use-case";
import AuthResetPasswordUseCase from "./use-cases/auth-reset-password.use-case";
import AuthSignupUseCase from "./use-cases/auth-signup.use-case";

export default class AuthController {
	static async signup({ body, set }) {
		try {
			const { success, ...rest } = await new AuthSignupUseCase().execute(body);
			return { success, ...rest };
		} catch (error: any) {
			set.status = 400;
			return {
				success: false,
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
				error: error.issues ?? error.message,
			};
		}
	}
}
