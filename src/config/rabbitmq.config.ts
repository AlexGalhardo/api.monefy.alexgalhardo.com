import amqp from "amqplib";
import { SMTP } from "./smtp.config";
import TelegramLog from "./telegram-logger.config";

export default class RabbitMQ {
    constructor(
        private connection?: amqp.Connection,
        private channel?: any,
        private readonly smtp = SMTP,
    ) {
        amqp.connect("amqp://localhost")
            .then((conn) => {
                this.connection = conn;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    public async sendMessageUserSignup(message: string) {
        console.log("Entrou sendMessageUserSignup com message: ", message);
        try {
            this.channel = await this.connection!.createChannel();
            await this.channel.assertQueue("user_signup_queue", {
                durable: true,
            });

            this.channel.sendToQueue("user_signup_queue", Buffer.from(JSON.stringify(message)), {
                persistent: true,
            });
        } catch (error) {
            console.log("Error sendMessageUserSignup: ", error);
        }
    }

    public async consumeMessages() {
        try {
            this.channel = await this.connection!.createChannel();

            process.once("SIGINT", async () => {
                await this.channel.close();
                await this.connection!.close();
            });

            await this.channel.assertQueue("user_signup_queue", { durable: true });
            await this.channel.consume(
                "user_signup_queue",
                async (message) => {
                    if (message) {
                        console.log("...Message received: ", JSON.parse(message.content.toString()));

                        await this.smtp.sendMail({
                            from: process.env.SMTP_EMAIL_FROM,
                            to: "aleexgvieira@gmail.com",
                            subject: `USER CREATED api-money-manager`,
                            html: `
							<p>A new user was registred</p>
							<p>User: ${message.content.toString()}</p>
						`,
                        });

                        TelegramLog.info(`\nUSER CREATED\n\n ${message.content.toString()}\n`);
                    }
                },
                { noAck: true },
            );

            console.log(" [*] Waiting for messages. To exit press CTRL+C");
        } catch (err) {
            console.warn(err);
        }
    }
}
