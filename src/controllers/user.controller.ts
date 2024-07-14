import { using_database } from "src/utils/constants.util";
import * as jwt from "jsonwebtoken";
import UserUpdateUseCase from "src/use-cases/user-update.use-case";

export default class UserController {
    static async update({ bearer, body, set }) {
        try {
            const { user_email } = jwt.verify(bearer, Bun.env.JWT_SECRET as string) as jwt.JwtPayload;
            const { success, data } = await new UserUpdateUseCase().execute({ email: user_email, ...body });
            if (success === true) set.status = 200;
            return { success: true, environment: Bun.env.ENVIRONMENT, using_database, data };
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
}
