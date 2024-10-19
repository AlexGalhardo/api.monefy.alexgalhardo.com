import { envsDevValidator } from "src/validators/envs-dev.validator";
import { envsLocalValidator } from "src/validators/envs-local.validator";
import { envsProductionValidator } from "src/validators/envs-production.validator";

export default function verifyEnvs() {
	if (Bun.env.NODE_ENV === "local") {
		const envLocalVariables = {
			NODE_ENV: Bun.env.NODE_ENV,
			SERVER_PORT: Bun.env.SERVER_PORT ? Number(Bun.env.SERVER_PORT) : undefined,
			APP_URL: Bun.env.APP_URL,
			USE_RABBITMQ: Bun.env.USE_RABBITMQ,
			USE_JSON_DATABASE: Bun.env.USE_JSON_DATABASE,
			USE_REDIS: Bun.env.USE_REDIS,
			USE_TELEGRAM_LOG: Bun.env.USE_TELEGRAM_LOG,
			LOG_PRISMA_QUERIES: Bun.env.LOG_PRISMA_QUERIES,
			REDIS_HOST: Bun.env.REDIS_HOST,
			REDIS_PORT: Bun.env.REDIS_PORT,
			JWT_SECRET: Bun.env.JWT_SECRET,
			DATABASE_URL: Bun.env.DATABASE_URL,
			TELEGRAM_BOT_HTTP_TOKEN: Bun.env.TELEGRAM_BOT_HTTP_TOKEN,
			TELEGRAM_BOT_CHANNEL_ID: Bun.env.TELEGRAM_BOT_CHANNEL_ID,
			SMTP_HOST: Bun.env.SMTP_HOST,
			SMTP_PORT: Bun.env.SMTP_PORT,
			SMTP_USER: Bun.env.SMTP_USER,
			SMTP_PASSWORD: Bun.env.SMTP_PASSWORD,
			SMTP_EMAIL_FROM: Bun.env.SMTP_EMAIL_FROM,
		};

		const validationResult = envsLocalValidator.safeParse(envLocalVariables);

		if (!validationResult.success) {
			console.error(
				"\n\nERROR: Alguma variável de ambiente LOCAL esta faltando ou setada incorretamente: ",
				validationResult.error.format(),
			);
			process.exit(1);
		}
	} else if (Bun.env.NODE_ENV === "dev") {
		const envHomologVariables = {
			NODE_ENV: Bun.env.NODE_ENV,
			SERVER_PORT: Bun.env.SERVER_PORT ? Number(Bun.env.SERVER_PORT) : undefined,
			APP_URL: Bun.env.APP_URL,
			USE_RABBITMQ: Bun.env.USE_RABBITMQ,
			USE_JSON_DATABASE: Bun.env.USE_JSON_DATABASE,
			USE_REDIS: Bun.env.USE_REDIS,
			USE_TELEGRAM_LOG: Bun.env.USE_TELEGRAM_LOG,
			LOG_PRISMA_QUERIES: Bun.env.LOG_PRISMA_QUERIES,
			REDIS_HOST: Bun.env.REDIS_HOST,
			REDIS_PORT: Bun.env.REDIS_PORT,
			JWT_SECRET: Bun.env.JWT_SECRET,
			DATABASE_URL: Bun.env.DATABASE_URL,
			TELEGRAM_BOT_HTTP_TOKEN: Bun.env.TELEGRAM_BOT_HTTP_TOKEN,
			TELEGRAM_BOT_CHANNEL_ID: Bun.env.TELEGRAM_BOT_CHANNEL_ID,
			SMTP_HOST: Bun.env.SMTP_HOST,
			SMTP_PORT: Bun.env.SMTP_PORT,
			SMTP_USER: Bun.env.SMTP_USER,
			SMTP_PASSWORD: Bun.env.SMTP_PASSWORD,
			SMTP_EMAIL_FROM: Bun.env.SMTP_EMAIL_FROM,
		};

		const validationResult = envsDevValidator.safeParse(envHomologVariables);

		if (!validationResult.success) {
			console.error(
				"\n\nERROR: Alguma variável de ambiente DEV esta faltando ou setada incorretamente: ",
				validationResult.error.format(),
			);
			process.exit(1);
		}
	} else if (Bun.env.NODE_ENV === "production") {
		const envProductionVariables = {
			NODE_ENV: Bun.env.NODE_ENV,
			SERVER_PORT: Bun.env.SERVER_PORT ? Number(Bun.env.SERVER_PORT) : undefined,
			APP_URL: Bun.env.APP_URL,
			USE_RABBITMQ: Bun.env.USE_RABBITMQ,
			USE_JSON_DATABASE: Bun.env.USE_JSON_DATABASE,
			USE_REDIS: Bun.env.USE_REDIS,
			USE_TELEGRAM_LOG: Bun.env.USE_TELEGRAM_LOG,
			LOG_PRISMA_QUERIES: Bun.env.LOG_PRISMA_QUERIES,
			REDIS_HOST: Bun.env.REDIS_HOST,
			REDIS_PORT: Bun.env.REDIS_PORT,
			JWT_SECRET: Bun.env.JWT_SECRET,
			DATABASE_URL: Bun.env.DATABASE_URL,
			TELEGRAM_BOT_HTTP_TOKEN: Bun.env.TELEGRAM_BOT_HTTP_TOKEN,
			TELEGRAM_BOT_CHANNEL_ID: Bun.env.TELEGRAM_BOT_CHANNEL_ID,
			SMTP_HOST: Bun.env.SMTP_HOST,
			SMTP_PORT: Bun.env.SMTP_PORT,
			SMTP_USER: Bun.env.SMTP_USER,
			SMTP_PASSWORD: Bun.env.SMTP_PASSWORD,
			SMTP_EMAIL_FROM: Bun.env.SMTP_EMAIL_FROM,
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
