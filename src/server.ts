import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { bearer } from "@elysiajs/bearer";
import HealthCheckController from "./controllers/health-check.controller";
import AuthController from "./controllers/auth.controller";
import ExpensesController from "./controllers/expenses.controller";
import ValidateHeaderAuthorizationBearerTokenMiddleware from "./middlewares/validate-header-authorization-bearer-token.middleware";
import { using_database } from "./utils/constants.util";
import UserController from "./controllers/user.controller";

export const app = new Elysia()
    .use(bearer())
    .use(
        swagger({
            documentation: {
                info: {
                    title: "Money Manager API Swagger Documenttion",
                    version: "2.0.0",
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
    .listen(Bun.env.PORT ?? 9000);

export const serverDNS = `${app.server?.hostname}:${app.server?.port}`;

console.log(`\n\n...🦊 API Money Manager Server is running at: http://${serverDNS}`);

console.log(`\n\n...🦊 API Money Manager environment: ${Bun.env.ENVIRONMENT}`);

console.log(`\n\n...🦊 API Money Manager using database: ${using_database}`);

console.log(`\n\n...🦊 API Money Manager use RabbitMQ: ${Bun.env.USE_RABBITMQ}\n\n`);

export type App = typeof app;
