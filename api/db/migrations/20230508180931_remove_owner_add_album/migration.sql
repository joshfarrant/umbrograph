/*
  Warnings:

  - You are about to drop the column `albumId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `File` table. All the data in the column will be lost.
  - Added the required column `albumId` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_File" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "albumId" TEXT NOT NULL,
    "data" TEXT NOT NULL
);
INSERT INTO "new_File" ("data", "id") SELECT "data", "id" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
