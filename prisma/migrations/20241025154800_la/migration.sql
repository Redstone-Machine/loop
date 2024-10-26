-- CreateTable
CREATE TABLE "PersonalProfilePicture" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "userIdOfProfilePicture" TEXT NOT NULL,
    "profilePictureUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
