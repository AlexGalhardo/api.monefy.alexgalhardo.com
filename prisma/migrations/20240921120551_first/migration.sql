-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('FOOD', 'HOUSE', 'ENTERTAINMENT', 'SUBSCRIPTIONS', 'TRANSPORT', 'CLOTHES', 'EDUCATION', 'SHOP', 'GIFTS', 'HEALTH', 'GOING_OUT', 'WORK', 'RENT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "phone_number" TEXT,
    "cpf" TEXT,
    "birth_date" TEXT,
    "address_street_name" TEXT,
    "address_cep" TEXT,
    "address_street_complement" TEXT,
    "address_street_number" INTEGER,
    "address_neighborhood" TEXT,
    "address_city" TEXT,
    "address_state" TEXT,
    "address_country" TEXT,
    "jwt_token" TEXT,
    "password" TEXT NOT NULL,
    "reset_password_token" TEXT,
    "reset_password_token_expires_at" TEXT,
    "confirm_email_valited" BOOLEAN NOT NULL DEFAULT false,
    "confirm_email_token" TEXT,
    "confirm_email_token_expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ExpenseCategory" NOT NULL,
    "amount" INTEGER NOT NULL,
    "created_at" TEXT NOT NULL,
    "updated_at" TEXT,
    "deleted_at" TEXT NOT NULL,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "users_jwt_token_key" ON "users"("jwt_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_reset_password_token_key" ON "users"("reset_password_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_confirm_email_token_key" ON "users"("confirm_email_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_reset_password_token_key" ON "users"("email", "reset_password_token");

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
