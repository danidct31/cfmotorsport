-- AlterTable
ALTER TABLE "JobItem" ADD COLUMN "dueDate" TIMESTAMP(3);
ALTER TABLE "JobItem" ADD COLUMN "priority" INTEGER NOT NULL DEFAULT 3;

-- CreateIndex
CREATE INDEX "JobItem_kind_priority_idx" ON "JobItem"("kind", "priority");
