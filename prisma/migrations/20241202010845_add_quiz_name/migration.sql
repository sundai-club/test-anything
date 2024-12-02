/*
  Warnings:

  - Added the required column `name` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Quiz" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "questions" TEXT NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "correctAnswers" INTEGER NOT NULL,
    "skippedQuestions" INTEGER NOT NULL,
    "timeSpent" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Quiz" ("correctAnswers", "createdAt", "id", "questions", "skippedQuestions", "text", "timeSpent", "totalQuestions") SELECT "correctAnswers", "createdAt", "id", "questions", "skippedQuestions", "text", "timeSpent", "totalQuestions" FROM "Quiz";
DROP TABLE "Quiz";
ALTER TABLE "new_Quiz" RENAME TO "Quiz";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
