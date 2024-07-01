/*
  Warnings:

  - You are about to drop the column `user_id` on the `expenses` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "expenses" DROP CONSTRAINT "expenses_user_id_fkey";

-- AlterTable
ALTER TABLE "expenses" DROP COLUMN "user_id";

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
