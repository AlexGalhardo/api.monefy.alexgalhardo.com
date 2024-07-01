import { z } from "zod";

const ExpenseCategory = z.enum([
    "FOOD",
    "HOUSE",
    "EDUCATION",
    "SUBSCRIPTIONS",
    "HEALTH",
    "TRANSPORT",
    "ENTERTAINMENT",
    "SHOP",
    "GIFTS",
    "RENT",
    "WORK",
    "GOING_OUT",
    "CLOTHES",
]);

const ExpenseUpdateValidator = z.object({
    user_email: z.string().email(),
    description: z.string().max(128, "Description must be at most 128 characters"),
    category: ExpenseCategory,
    amount: z.number().min(100, "Amount must be at least 100").max(999999999, "Amount must be at most 999999999"),
});

export default ExpenseUpdateValidator;
