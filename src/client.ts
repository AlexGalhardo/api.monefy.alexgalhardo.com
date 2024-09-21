import { treaty } from "@elysiajs/eden";
import { ExpenseCategory } from "@prisma/client";
import { type App, serverDNS } from "./server";

const client = treaty<App>(serverDNS);

(async () => {
    const { data: healthcheck } = await client.index.get();

    const { data: signup } = await client.signup.post({
        name: "client_test",
        email: "client_test@gmail.com",
        password: "client_testQWE!123",
    });

    const { data: login } = await client.login.post({
        email: "client_test@gmail.com",
        password: "client_testQWE!123",
    });

    // const { data: forgetPassword } = await client["forget-password"].post({
    // 	email: "client_test@gmail.com"
    // });

    // const { data: resetPassword } = await client["reset-password"]({ email: 'email' }).post({
    // 	new_password: "client_test@gmail.com",
    // 	confirm_new_password: "client_testQWE!123",
    // });

    const { data: newExpenseCreated } = await client.expenses.index.post(
        {
            description: "new expense client test",
            category: ExpenseCategory.GIFTS,
            amount: 20000,
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${login?.data?.jwt_token}`,
            },
        },
    );

    const { data: getExpenseById } = await client.expenses({ id: newExpenseCreated?.data?.id as string }).get({
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${login?.data?.jwt_token}`,
        },
    });

    const { data: getAllExpenses } = await client.expenses.index.get({
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${login?.data?.jwt_token}`,
        },
    });

    console.log("healthcheck => ", healthcheck);

    console.log("signup => ", signup);

    console.log("login => ", login);

    // console.log("forgetPassword => ", forgetPassword);

    // console.log("resetPassword => ", resetPassword);

    console.log("getExpenseById => ", getExpenseById);

    console.log("newExpenseCreated => ", newExpenseCreated);

    console.log("getAllExpenses => ", getAllExpenses);
})();
