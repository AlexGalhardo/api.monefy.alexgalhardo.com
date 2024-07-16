import ExpenseCreateUseCase from "src/use-cases/expense-create.use-case";
import ExpenseDeleteUseCase from "src/use-cases/expense-delete.use-case";
import ExpenseGetAllUseCase from "src/use-cases/expense-get-all.use-case";
import ExpenseGetByIdUseCase from "src/use-cases/expense-get-by-id.use-case";
import ExpenseUpdateUseCase from "src/use-cases/expense-update.use-case";
import { using_database } from "src/utils/constants.util";
import * as jwt from "jsonwebtoken";
import ExpenseGetStatisticsUseCase from "src/use-cases/expenses-get-statistics.use-case";

export default class ExpensesController {
    static async getAll({ bearer, set }) {
        try {
            const { user_email } = jwt.verify(bearer, Bun.env.JWT_SECRET as string) as jwt.JwtPayload;
            const { success, data } = await new ExpenseGetAllUseCase().execute({ user_email });
            if (success === true) return { success: true, environment: Bun.env.ENVIRONMENT, using_database, data };
        } catch (error: any) {
            set.status = 400;
            return {
                success: false,
                environment: Bun.env.ENVIRONMENT,
                using_database,
                error: error.issues ?? error.message,
            };
        }
    }

    static async getStatistics({ bearer, set }) {
        try {
            const { user_email } = jwt.verify(bearer, Bun.env.JWT_SECRET as string) as jwt.JwtPayload;
            const { success, data } = await new ExpenseGetStatisticsUseCase().execute({ user_email });
            if (success === true) return { success: true, environment: Bun.env.ENVIRONMENT, using_database, data };
        } catch (error: any) {
            set.status = 400;
            return {
                success: false,
                environment: Bun.env.ENVIRONMENT,
                using_database,
                error: error.issues ?? error.message,
            };
        }
    }

    static async getById({ bearer, params: { id }, set }) {
        try {
            const { user_email } = jwt.verify(bearer, Bun.env.JWT_SECRET as string) as jwt.JwtPayload;
            const { success, data } = await new ExpenseGetByIdUseCase().execute({ id, user_email });
            if (success === true) return { success: true, environment: Bun.env.ENVIRONMENT, using_database, data };
        } catch (error: any) {
            set.status = 400;
            return {
                success: false,
                environment: Bun.env.ENVIRONMENT,
                using_database,
                error: error.issues ?? error.message,
            };
        }
    }

    static async create({ bearer, body, set }) {
        try {
            const { user_email } = jwt.verify(bearer, Bun.env.JWT_SECRET as string) as jwt.JwtPayload;
            const { success, data } = await new ExpenseCreateUseCase().execute({ user_email, ...body });
            if (success === true) return { success: true, environment: Bun.env.ENVIRONMENT, using_database, data };
        } catch (error: any) {
            set.status = 400;
            return {
                success: false,
                environment: Bun.env.ENVIRONMENT,
                using_database,
                error: error.issues ?? error.message,
            };
        }
    }

    static async update({ bearer, params: { id }, body: { description, category, amount }, set }) {
        try {
            const { user_email } = jwt.verify(bearer, Bun.env.JWT_SECRET as string) as jwt.JwtPayload;
            const { success, data } = await new ExpenseUpdateUseCase().execute({
                user_email,
                id,
                description,
                category,
                amount,
            });
            if (success === true) return { success: true, environment: Bun.env.ENVIRONMENT, using_database, data };
        } catch (error: any) {
            set.status = 400;
            return {
                success: false,
                environment: Bun.env.ENVIRONMENT,
                using_database,
                error: error.issues ?? error.message,
            };
        }
    }

    static async delete({ bearer, params: { id }, set }) {
        try {
            const { user_email } = jwt.verify(bearer, Bun.env.JWT_SECRET as string) as jwt.JwtPayload;
            const { success, data, message } = await new ExpenseDeleteUseCase().execute({ id, user_email });
            if (success === true)
                return { success: true, environment: Bun.env.ENVIRONMENT, using_database, data, message };
        } catch (error: any) {
            set.status = 400;
            return {
                success: false,
                environment: Bun.env.ENVIRONMENT,
                using_database,
                error: error.issues ?? error.message,
            };
        }
    }
}
