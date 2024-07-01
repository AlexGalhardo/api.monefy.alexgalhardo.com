import { treaty } from "@elysiajs/eden";
import { serverDNS, type App } from "./server";
import { ExpenseCategory } from "@prisma/client";

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

    console.log("getExpenseById => ", getExpenseById);

    console.log("newExpenseCreated => ", newExpenseCreated);

    console.log("getAllExpenses => ", getAllExpenses);
})();
