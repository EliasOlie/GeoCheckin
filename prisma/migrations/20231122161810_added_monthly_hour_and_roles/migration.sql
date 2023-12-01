-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADM', 'USR');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "monthlyHours" INTEGER NOT NULL DEFAULT 80,
ADD COLUMN     "role" "Roles" NOT NULL DEFAULT 'USR';
