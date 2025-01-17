/*
  Warnings:

  - The `status` column on the `GroupInvite` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "GroupInvite" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';
