/*
  Warnings:

  - The `status` column on the `FriendRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "FriendRequest" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';
