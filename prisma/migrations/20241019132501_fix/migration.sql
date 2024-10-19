/*
  Warnings:

  - The `created_at` column on the `expenses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `updated_at` column on the `expenses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deleted_at` column on the `expenses` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "expenses" DROP COLUMN "created_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "updated_at",
ADD COLUMN     "updated_at" TIMESTAMP(3),
DROP COLUMN "deleted_at",
ADD COLUMN     "deleted_at" TIMESTAMP(3);
