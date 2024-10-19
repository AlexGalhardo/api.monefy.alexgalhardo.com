import { z } from "zod";

export const AuthResetPasswordValidator = z
	.object({
		email: z.string().email(),
		reset_password_token: z
			.string()
			.min(48, '"reset_password_token" must be at least 48 characters')
			.max(48, '"reset_password_token" must be at most 48 characters'),
		new_password: z
			.string()
			.min(8, "password must be at least 8 characters long")
			.refine((val) => /[A-Z]/.test(val), "password must contain at least one uppercase letter")
			.refine((val) => /[a-z]/.test(val), "password must contain at least one lowercase letter")
			.refine((val) => /[0-9]/.test(val), "password must contain at least one number")
			.refine(
				(val) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
				"password must contain at least one special character",
			),
		confirm_new_password: z
			.string()
			.min(8, "password must be at least 8 characters long")
			.refine((val) => /[A-Z]/.test(val), "password must contain at least one uppercase letter")
			.refine((val) => /[a-z]/.test(val), "password must contain at least one lowercase letter")
			.refine((val) => /[0-9]/.test(val), "password must contain at least one number")
			.refine(
				(val) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
				"password must contain at least one special character",
			),
	})
	.refine((data) => data.new_password === data.confirm_new_password, {
		message: "confirm new password must be equal to new password",
		path: ["confirm_new_password"],
	});
