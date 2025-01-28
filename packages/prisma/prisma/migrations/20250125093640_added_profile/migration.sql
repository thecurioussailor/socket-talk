-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "coverImage" TEXT,
    "bio" TEXT,
    "languages" TEXT[],
    "location" TEXT,
    "instagram" TEXT,
    "x" TEXT,
    "discord" TEXT,
    "interests" TEXT[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
