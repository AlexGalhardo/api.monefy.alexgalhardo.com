import { bearer } from "@elysiajs/bearer";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import ValidateHeaderAuthorizationBearerTokenMiddleware from "./middlewares/validate-header-authorization-bearer-token.middleware";
import AuthController from "./modules/auth/auth.controller";
import ExpensesController from "./modules/expenses/expenses.controller";
import HealthCheckController from "./modules/health-check/health-check.controller";
import UserController from "./modules/user/user.controller";
import { using_database } from "./utils/constants.util";
import verifyEnvs from "./utils/verify-envs.util";

verifyEnvs();

export const app = new Elysia()
    .use(bearer())
    .use(
        swagger({
            documentation: {
                info: {
                    title: "Monefy API Swagger Documenttion",
                    version: "3.0.0",
                },
            },
        }),
    )
    .onError((context) => {
        return {
            success: false,
            error: context.error.toString(),
            context: context,
        };
    })
    .get("/", HealthCheckController.index)
    .post("/signup", AuthController.signup)
    .post("/login", AuthController.login)
    .post("/forget-password", AuthController.forgetPassword)
    .post("/reset-password/:email/:token", AuthController.resetPassword)
    .guard(
        {
            beforeHandle: ValidateHeaderAuthorizationBearerTokenMiddleware,
        },
        (app) =>
            app
                .group("/expenses", (app) =>
                    app
                        .get("/", ExpensesController.getAll)
                        .get("/:id", ExpensesController.getById)
                        .get("/statistics", ExpensesController.getStatistics)
                        .post("/", ExpensesController.create)
                        .patch("/:id", ExpensesController.update)
                        .delete("/:id", ExpensesController.delete),
                )
                .group("/user", (app) => app.patch("/", UserController.update)),
    )
    .listen(Bun.env.SERVER_PORT ?? 3000);

export const serverDNS = `${app.server?.hostname}:${app.server?.port}`;

console.log(`\n\n...🦊 api.monefy.alexgalhardo.com Server is running at: http://${serverDNS}`);

console.log(`\n\n...🦊 api.monefy.alexgalhardo.com environment: ${Bun.env.NODE_ENV}`);

console.log(`\n\n...🦊 api.monefy.alexgalhardo.com using database: ${using_database}`);

console.log(`\n\n...🦊 api.monefy.alexgalhardo.com use RabbitMQ: ${Bun.env.USE_RABBITMQ}\n\n`);

export type App = typeof app;
