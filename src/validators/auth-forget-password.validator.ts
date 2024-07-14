import { z } from "zod";

const AuthForgetPasswordValidator = z.object({
    email: z.string().email(),
});

export default AuthForgetPasswordValidator;
