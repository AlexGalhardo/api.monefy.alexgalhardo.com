import { z } from "zod";

export const AuthForgetPasswordValidator = z.object({
	email: z.string().email(),
});
