import { z } from "zod";

export const envsDevValidator = z.object({
    NODE_ENV: z.enum(["dev"]),
    SERVER_PORT: z.number().default(3000),
    APP_URL: z.string().refine((url) => url === "https://api.dev.monefy.alexgalhardo.com", {
        message: "APP_URL must be https://api.dev.monefy.alexgalhardo.com",
    }),
    USE_RABBITMQ: z.enum(["true", "false"]),
    USE_JSON_DATABASE: z.enum(["true", "false"]),
    USE_REDIS: z.enum(["true", "false"]),
    USE_TELEGRAM_LOG: z.enum(["true", "false"]),
    LOG_PRISMA_QUERIES: z.enum(["true", "false"]),
    REDIS_HOST: z.string(),
    REDIS_PORT: z.string().default("6379"),
    JWT_SECRET: z.string().default("6671e43107a8037a9c02a640fc88f9ea79d36bb3266381db482013eea842dd1c"),
    DATABASE_URL: z.string(),
    TELEGRAM_BOT_HTTP_TOKEN: z.string(),
    TELEGRAM_BOT_CHANNEL_ID: z.string(),
    SMTP_HOST: z.string(),
    SMTP_PORT: z.string(),
    SMTP_USER: z.string(),
    SMTP_PASSWORD: z.string(),
    SMTP_EMAIL_FROM: z.string(),
});
