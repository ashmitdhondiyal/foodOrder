-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "category" TEXT,
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "cuisine" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "phone" TEXT;
