-- First add the column as nullable
ALTER TABLE "Quiz" ADD COLUMN "name" TEXT;

-- Update existing records with a default name
UPDATE "Quiz" SET "name" = 'Untitled Quiz #' || CAST(rowid AS TEXT);

-- Make the column required
ALTER TABLE "Quiz" ALTER COLUMN "name" SET NOT NULL; 