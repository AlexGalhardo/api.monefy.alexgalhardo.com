import amqp from "amqplib";
import { SMTP } from "./smtp.config";
import TelegramLog from "./telegram-logger.config";

export default class RabbitMQ {
    private connection?: amqp.Connection;
    private channelAuthSignupQueue?: amqp.Channel;
    private channelAuthForgetPasswordQueue?: amqp.Channel;
    private readonly smtp = SMTP;

    constructor() {
        if (Bun.env.USE_RABBITMQ === "true") {
            amqp.connect("amqp://localhost")
                .then((conn) => {
                    this.connection = conn;
                    return this.setupChannels();
                })
                .then(() => {
                    console.log("RabbitMQ channels and queues are set up.");
                })
                .catch((err) => {
                    console.error("Error connecting to RabbitMQ: ", err);
                });
        }
    }

    private async setupChannels() {
        if (this.connection) {
            try {
                this.channelAuthSignupQueue = await this.connection.createChannel();
                this.channelAuthForgetPasswordQueue = await this.connection.createChannel();

                await this.channelAuthSignupQueue.assertQueue("auth_signup_queue", { durable: true });
                await this.channelAuthForgetPasswordQueue.assertQueue("auth_forget_password_queue", { durable: true });
            } catch (error) {
                console.error("Error setting up RabbitMQ channels: ", error);
            }
        }
    }

    private async ensureChannelsAvailable() {
        if (!this.channelAuthSignupQueue || !this.channelAuthForgetPasswordQueue) {
            console.log("Channels are not available. Setting up channels...");
            await this.setupChannels();
            console.log("Channels setup completed.");
        } else {
            console.log("Channels are already available.");
        }
    }

    public async sendMessageUserSignup(message: string) {
        try {
            await this.ensureChannelsAvailable();
            if (this.channelAuthSignupQueue) {
                this.channelAuthSignupQueue.sendToQueue("auth_signup_queue", Buffer.from(message), {
                    persistent: true,
                });
                console.log("Message sent to auth_signup_queue: ", message);
            }
        } catch (error) {
            console.error("Error sending message to auth_signup_queue: ", error);
        }
    }

    public async sendMessageForgetPassword(message: string) {
        try {
            await this.ensureChannelsAvailable();
            if (this.channelAuthForgetPasswordQueue) {
                console.log("...ENTROU");
                this.channelAuthForgetPasswordQueue.sendToQueue("auth_forget_password_queue", Buffer.from(message), {
                    persistent: true,
                });
                console.log("Message sent to auth_forget_password_queue: ", message);
            } else {
                console.log("Channel for auth_forget_password_queue is still not available after setup.");
            }
        } catch (error) {
            console.error("Error sending message to auth_forget_password_queue: ", error);
        }
    }

    public async consumeMessages() {
        try {
            await this.ensureChannelsAvailable();
            if (this.channelAuthSignupQueue && this.channelAuthForgetPasswordQueue) {
                process.once("SIGINT", async () => {
                    await this.channelAuthSignupQueue?.close();
                    await this.channelAuthForgetPasswordQueue?.close();
                    await this.connection?.close();
                });

                this.channelAuthSignupQueue.consume(
                    "auth_signup_queue",
                    async (message) => {
                        if (message) {
                            const content = message.content.toString();
                            console.log("Message received in auth_signup_queue: ", content);

                            await this.smtp.sendMail({
                                from: process.env.SMTP_EMAIL_FROM,
                                to: "aleexgvieira@gmail.com",
                                subject: "USER CREATED api-money-manager",
                                html: `<p>A new user was registered</p><p>User: ${content}</p>`,
                            });

                            TelegramLog.info(`USER CREATED: ${content}`);
                        }
                    },
                    { noAck: true },
                );

                this.channelAuthForgetPasswordQueue.consume(
                    "auth_forget_password_queue",
                    async (message) => {
                        if (message) {
                            const content = message.content.toString();
                            console.log("Message received in auth_forget_password_queue: ", content);

                            await this.smtp.sendMail({
                                from: process.env.SMTP_EMAIL_FROM,
                                to: "aleexgvieira@gmail.com",
                                subject: "Forget password api-money-manager",
                                html: `<p>Forget password link:</p><p>User: ${content}</p>`,
                            });

                            TelegramLog.info(`Forget Password: ${content}`);
                        }
                    },
                    { noAck: true },
                );

                console.log("RabbitMQ is waiting for messages... To exit press CTRL+C");
            }
        } catch (error) {
            console.error("Error consuming messages: ", error);
        }
    }
}
