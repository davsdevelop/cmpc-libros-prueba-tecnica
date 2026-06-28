/*
  Warnings:

  - You are about to drop the column `author` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `editorial` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `genre` on the `Book` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `editorialId` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genreId` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "author",
DROP COLUMN "editorial",
DROP COLUMN "genre",
ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD COLUMN     "editorialId" INTEGER NOT NULL,
ADD COLUMN     "genreId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Author" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Editorial" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Editorial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Author_name_key" ON "Author"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Editorial_name_key" ON "Editorial"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- CreateIndex
CREATE INDEX "Book_title_idx" ON "Book"("title");

-- CreateIndex
CREATE INDEX "Book_authorId_idx" ON "Book"("authorId");

-- CreateIndex
CREATE INDEX "Book_editorialId_idx" ON "Book"("editorialId");

-- CreateIndex
CREATE INDEX "Book_genreId_idx" ON "Book"("genreId");

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_editorialId_fkey" FOREIGN KEY ("editorialId") REFERENCES "Editorial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
