-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "draftStyles" JSONB,
ADD COLUMN     "draftValue" TEXT,
ADD COLUMN     "hasDraft" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "value" SET DEFAULT '';
