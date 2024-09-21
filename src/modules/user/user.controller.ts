import * as jwt from "jsonwebtoken";
import UserUpdateUseCase from "src/modules/user/user-update.use-case";
import { using_database } from "src/utils/constants.util";

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
                environment: Bun.env.ENVIRONMENT,
                using_database,
                error: error.issues ?? error.message,
                stack: error.stack,
            };
        }
    }
}
