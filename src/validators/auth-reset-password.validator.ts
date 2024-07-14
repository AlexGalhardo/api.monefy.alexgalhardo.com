import { z } from "zod";

const AuthResetPasswordValidator = z
    .object({
        name: z.string().min(4, "name must be at least 4 characters long"),
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

export default AuthResetPasswordValidator;
