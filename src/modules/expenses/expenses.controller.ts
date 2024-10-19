import * as jwt from "jsonwebtoken";
import ExpenseCreateUseCase from "src/modules/expenses/use-cases/expense-create.use-case";
import ExpenseDeleteUseCase from "src/modules/expenses/use-cases/expense-delete.use-case";
import ExpenseGetAllUseCase from "src/modules/expenses/use-cases/expense-get-all.use-case";
import ExpenseGetByIdUseCase from "src/modules/expenses/use-cases/expense-get-by-id.use-case";
import ExpenseUpdateUseCase from "src/modules/expenses/use-cases/expense-update.use-case";
import ExpenseGetStatisticsUseCase from "src/modules/expenses/use-cases/expenses-get-statistics.use-case";
import { using_database } from "src/utils/constants.util";

export default class ExpensesController {
    static async getAll({ bearer, set }) {
        try {
            const { user_email } = jwt.verify(bearer, Bun.env.JWT_SECRET as string) as jwt.JwtPayload;
            const { success, ...rest } = await new ExpenseGetAllUseCase().execute({ user_email });
            return { success, ...rest };
        } catch (error: any) {
            set.status = 400;
            return {
                success: false,
                environment: Bun.env.NODE_ENV,
                using_database,
                error: error.issues ?? error.message,
            };
        }
    }

    static async getStatistics({ bearer, set }) {
        try {
            const { user_email } = jwt.verify(bearer, Bun.env.JWT_SECRET as string) as jwt.JwtPayload;
            const { success, ...rest } = await new ExpenseGetStatisticsUseCase().execute({ user_email });
            return { success, ...rest };
        } catch (error: any) {
            set.status = 400;
            return {
                success: false,
                environment: Bun.env.NODE_ENV,
                using_database,
                error: error.issues ?? error.message,
            };
        }
    }

    static async getById({ bearer, params: { id }, set }) {
        try {
            const { user_email } = jwt.verify(bearer, Bun.env.JWT_SECRET as string) as jwt.JwtPayload;
            const { success, ...rest } = await new ExpenseGetByIdUseCase().execute({ id, user_email });
            return { success, ...rest };
        } catch (error: any) {
            set.status = 400;
            return {
                success: false,
                environment: Bun.env.NODE_ENV,
                using_database,
                error: error.issues ?? error.message,
            };
        }
    }

    static async create({ bearer, body, set }) {
        try {
            const { user_email } = jwt.verify(bearer, Bun.env.JWT_SECRET as string) as jwt.JwtPayload;
            const { success, ...rest } = await new ExpenseCreateUseCase().execute({ user_email, ...body });
            return { success, ...rest };
        } catch (error: any) {
            set.status = 400;
            return {
                success: false,
                environment: Bun.env.NODE_ENV,
                using_database,
                error: error.issues ?? error.message,
            };
        }
    }

    static async update({ bearer, params: { id }, body: { description, category, amount }, set }) {
        try {
            const { user_email } = jwt.verify(bearer, Bun.env.JWT_SECRET as string) as jwt.JwtPayload;
            const { success, ...rest } = await new ExpenseUpdateUseCase().execute({
                user_email,
                id,
                description,
                category,
                amount,
            });
            return { success, ...rest };
        } catch (error: any) {
            set.status = 400;
            return {
                success: false,
                environment: Bun.env.NODE_ENV,
                using_database,
                error: error.issues ?? error.message,
            };
        }
    }

    static async delete({ bearer, params: { id }, set }) {
        try {
            const { user_email } = jwt.verify(bearer, Bun.env.JWT_SECRET as string) as jwt.JwtPayload;
            const { success, ...rest } = await new ExpenseDeleteUseCase().execute({ id, user_email });
            return { success, ...rest };
        } catch (error: any) {
            set.status = 400;
            return {
                success: false,
                environment: Bun.env.NODE_ENV,
                using_database,
                error: error.issues ?? error.message,
            };
        }
    }
}
