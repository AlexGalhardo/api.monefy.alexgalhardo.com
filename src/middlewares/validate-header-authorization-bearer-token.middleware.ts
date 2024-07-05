import { using_database } from "src/utils/constants.util";
import { ErrorsMessages } from "src/utils/errors-messages.util";
import * as jwt from "jsonwebtoken";
import UsersRepository from "src/repositories/users.repository";

const ValidateHeaderAuthorizationBearerTokenMiddleware = async ({ bearer, set }: any) => {
    try {
        if (!bearer) {
            set.status = 401;
            set.headers["WWW-Authenticate"] = `Bearer realm='sign', error="invalid_request"`;

            return {
                success: false,
                environment: Bun.env.ENVIRONMENT,
                using_database,
                message: ErrorsMessages.HEADER_AUTHORIZATION_BEARER_TOKEN_REQUIRED,
            };
        }

        const jwtDecoded = jwt.verify(bearer, Bun.env.JWT_SECRET as string) as jwt.JwtPayload;

        const userFoundAndJwtValidated = await new UsersRepository().findByEmail(jwtDecoded.user_email);

        if (!userFoundAndJwtValidated) {
            set.status = 401;
            return {
                success: false,
                environment: Bun.env.ENVIRONMENT,
                using_database,
                message: ErrorsMessages.HEADER_AUTHORIZATION_BEARER_TOKEN_INVALID,
            };
        }
    } catch (error) {
        set.status = 401;
        return {
            success: false,
            environment: Bun.env.ENVIRONMENT,
            using_database,
            message: ErrorsMessages.HEADER_AUTHORIZATION_BEARER_TOKEN_INVALID,
        };
    }
};

export default ValidateHeaderAuthorizationBearerTokenMiddleware;
