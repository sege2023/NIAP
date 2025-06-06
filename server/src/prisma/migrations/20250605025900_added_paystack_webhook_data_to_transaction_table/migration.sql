/*
  Warnings:

  - The primary key for the `Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `walletBalance` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - Added the required column `currency` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `userId` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_pkey",
ADD COLUMN     "channel" TEXT,
ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "customerCode" TEXT,
ADD COLUMN     "fees" DECIMAL(10,2),
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "gatewayResponse" TEXT,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "relatedTransactionId" BIGINT,
ADD COLUMN     "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "type" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" BIGINT NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2),
ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "walletBalance" SET DEFAULT 0,
ALTER COLUMN "walletBalance" SET DATA TYPE DECIMAL(10,2);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
