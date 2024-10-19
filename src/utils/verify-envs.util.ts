import { envsDevValidator } from "src/validators/envs-homolog.validator";
import { envsLocalValidator } from "src/validators/envs-local.validator";
import { envsProductionValidator } from "src/validators/envs-production.validator";

export default function verifyEnvs() {
    if (process.env.NODE_ENV === "local") {
        const envLocalVariables = {
            NODE_ENV: process.env.NODE_ENV,
            SERVER_PORT: process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : undefined,
            APP_URL: process.env.APP_URL,
            USE_RABBITMQ: process.env.USE_RABBITMQ,
            USE_JSON_DATABASE: process.env.USE_JSON_DATABASE,
            USE_REDIS: process.env.USE_REDIS,
            REDIS_HOST: process.env.REDIS_HOST,
            REDIS_PORT: process.env.REDIS_PORT,
            JWT_SECRET: process.env.JWT_SECRET,
            DATABASE_URL: process.env.DATABASE_URL,
            TELEGRAM_BOT_HTTP_TOKEN: process.env.TELEGRAM_BOT_HTTP_TOKEN,
            TELEGRAM_BOT_CHANNEL_ID: process.env.TELEGRAM_BOT_CHANNEL_ID,
            SMTP_HOST: process.env.SMTP_HOST,
            SMTP_PORT: process.env.SMTP_PORT,
            SMTP_USER: process.env.SMTP_USER,
            SMTP_PASSWORD: process.env.SMTP_PASSWORD,
            SMTP_EMAIL_FROM: process.env.SMTP_EMAIL_FROM,
        };

        const validationResult = envsLocalValidator.safeParse(envLocalVariables);

        if (!validationResult.success) {
            console.error(
                "\n\nERROR: Alguma variável de ambiente LOCAL esta faltando ou setada incorretamente: ",
                validationResult.error.format(),
            );
            process.exit(1);
        }
    } else if (process.env.NODE_ENV === "dev") {
        const envHomologVariables = {
            NODE_ENV: process.env.NODE_ENV,
            SERVER_PORT: process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : undefined,
            APP_URL: process.env.APP_URL,
            USE_RABBITMQ: process.env.USE_RABBITMQ,
            USE_JSON_DATABASE: process.env.USE_JSON_DATABASE,
            USE_REDIS: process.env.USE_REDIS,
            REDIS_HOST: process.env.REDIS_HOST,
            REDIS_PORT: process.env.REDIS_PORT,
            JWT_SECRET: process.env.JWT_SECRET,
            DATABASE_URL: process.env.DATABASE_URL,
            TELEGRAM_BOT_HTTP_TOKEN: process.env.TELEGRAM_BOT_HTTP_TOKEN,
            TELEGRAM_BOT_CHANNEL_ID: process.env.TELEGRAM_BOT_CHANNEL_ID,
            SMTP_HOST: process.env.SMTP_HOST,
            SMTP_PORT: process.env.SMTP_PORT,
            SMTP_USER: process.env.SMTP_USER,
            SMTP_PASSWORD: process.env.SMTP_PASSWORD,
            SMTP_EMAIL_FROM: process.env.SMTP_EMAIL_FROM,
        };

        const validationResult = envsDevValidator.safeParse(envHomologVariables);

        if (!validationResult.success) {
            console.error(
                "\n\nERROR: Alguma variável de ambiente HOMOLOG esta faltando ou setada incorretamente: ",
                validationResult.error.format(),
            );
            process.exit(1);
        }
    } else if (process.env.NODE_ENV === "production") {
        const envProductionVariables = {
            NODE_ENV: process.env.NODE_ENV,
            SERVER_PORT: process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : undefined,
            APP_URL: process.env.APP_URL,
            USE_RABBITMQ: process.env.USE_RABBITMQ,
            USE_JSON_DATABASE: process.env.USE_JSON_DATABASE,
            USE_REDIS: process.env.USE_REDIS,
            REDIS_HOST: process.env.REDIS_HOST,
            REDIS_PORT: process.env.REDIS_PORT,
            JWT_SECRET: process.env.JWT_SECRET,
            DATABASE_URL: process.env.DATABASE_URL,
            TELEGRAM_BOT_HTTP_TOKEN: process.env.TELEGRAM_BOT_HTTP_TOKEN,
            TELEGRAM_BOT_CHANNEL_ID: process.env.TELEGRAM_BOT_CHANNEL_ID,
            SMTP_HOST: process.env.SMTP_HOST,
            SMTP_PORT: process.env.SMTP_PORT,
            SMTP_USER: process.env.SMTP_USER,
            SMTP_PASSWORD: process.env.SMTP_PASSWORD,
            SMTP_EMAIL_FROM: process.env.SMTP_EMAIL_FROM,
        };

        const validationResult = envsProductionValidator.safeParse(envProductionVariables);

        if (!validationResult.success) {
            console.error(
                "\n\nERROR: Alguma variável de ambiente PRODUCTION esta faltando ou setada incorretamente: ",
                validationResult.error.format(),
            );
            process.exit(1);
        }
    }
}
