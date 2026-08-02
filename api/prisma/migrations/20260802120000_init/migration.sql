-- CreateEnum
CREATE TYPE "ListKind" AS ENUM ('PRIMARY', 'WEEKLY', 'TODO', 'DESK');

-- CreateTable
CREATE TABLE "JobItem" (
    "id" TEXT NOT NULL,
    "kind" "ListKind" NOT NULL,
    "text" TEXT NOT NULL,
    "checked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "JobItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobNote" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "checked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "JobNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobItem_kind_idx" ON "JobItem"("kind");

-- CreateIndex
CREATE INDEX "JobNote_parentId_idx" ON "JobNote"("parentId");
