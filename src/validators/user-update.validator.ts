import { z } from "zod";

const BRAZIL_VALID_PHONE_DDD = [
    11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48,
    49, 51, 53, 54, 55, 61, 62, 64, 63, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89,
    91, 92, 93, 94, 95, 96, 97, 98, 99,
];

const isValidPhoneNumber = (phone: string | undefined) => {
    if (!phone) return false;
    phone = phone.replace(/\D/g, "");
    if (phone.length !== 13) return false;
    if (Number.parseInt(phone.substring(4, 5)) !== 9) return false;
    if (new Set(phone).size === 1) return false;
    if (BRAZIL_VALID_PHONE_DDD.indexOf(Number.parseInt(phone.substring(2, 4))) === -1) return false;

    return true;
};

const isValidCPF = (cpf: string | undefined) => {
    if (!cpf) return false;
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11) return false;
    if (new Set(cpf).size === 1) return false;

    return true;
};

const isValidBirthDate = (birthDate: string | undefined) => {
    if (!birthDate) return false;

    const cleanedDate = birthDate.replace(/\D/g, "");

    if (cleanedDate.length !== 8) return false;

    const day = Number.parseInt(cleanedDate.substring(0, 2), 10);
    const month = Number.parseInt(cleanedDate.substring(2, 4), 10);
    const year = Number.parseInt(cleanedDate.substring(4, 8), 10);

    const currentYear = new Date().getFullYear();

    if (day < 1 || day > 31) return false;
    if (month < 1 || month > 12) return false;
    if (year < 1920 || year > currentYear) return false;

    const date = new Date(year, month - 1, day);
    if (date.getDate() !== day || date.getMonth() + 1 !== month || date.getFullYear() !== year) {
        return false;
    }

    return true;
};

const UserUpdateValidator = z.object({
    name: z.string().min(4, "name must be at least 4 characters long").optional(),
    email: z.string().email(),
    password: z
        .string()
        .min(8, "password must be at least 8 characters long")
        .refine((val) => /[A-Z]/.test(val), "password must contain at least one uppercase letter")
        .refine((val) => /[a-z]/.test(val), "password must contain at least one lowercase letter")
        .refine((val) => /[0-9]/.test(val), "password must contain at least one number")
        .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), "password must contain at least one special character")
        .optional(),
    phoneNumber: z.string().refine(isValidPhoneNumber, "Invalid phone number").optional(),
    cpf: z.string().refine(isValidCPF, "Invalid CPF").optional(),
    birthDate: z.string().refine(isValidBirthDate, "Invalid birth date").optional(),
    addressStreetName: z.string().min(1, "Street name is required.").optional(),
    addressCep: z
        .string()
        .transform((value) => value.replace(/\D/g, ""))
        .refine((value) => /^\d{8}$/.test(value), "CEP must be 8 digits.")
        .optional(),
    addressStreetComplement: z.string().optional(),
    addressStreetNumber: z
        .string()
        .refine((val) => /^[0-9]+$/.test(val), { message: "Street number must contain only numeric characters." })
        .refine((val) => Number.parseInt(val) >= 1 && Number.parseInt(val) <= 9999, {
            message: "Street number must be between 1 and 9999.",
        })
        .optional(),
    addressNeighborhood: z.string().min(1, "Neighborhood is required.").optional(),
    addressCity: z.string().min(1, "City is required.").optional(),
    addressState: z.string().min(1, "State is required.").optional(),
    addressCountry: z.string().min(1, "Country is required.").optional(),
});

export default UserUpdateValidator;
