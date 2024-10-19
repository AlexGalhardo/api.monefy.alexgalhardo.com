import * as jwt from "jsonwebtoken";
import UserUpdateUseCase from "src/modules/user/use-cases/user-update.use-case";

export default class UserController {
    static async update({ bearer, body, set }) {
        try {
            const { user_email } = jwt.verify(bearer, Bun.env.JWT_SECRET as string) as jwt.JwtPayload;
            const { success, ...rest } = await new UserUpdateUseCase().execute({ email: user_email, ...body });
            return { success, ...rest };
        } catch (error: any) {
            set.status = 400;
            return {
                success: false,
                error: error.issues ?? error.message,
                stack: error.stack,
            };
        }
    }
}
