-- AlterTable
ALTER TABLE "users" ADD COLUMN     "needPasswordChange" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "userStatus" SET DEFAULT 'ACTIVE';
