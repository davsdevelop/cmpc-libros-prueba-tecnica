import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../config/db/prisma.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { FindAllBooksDto } from "./dto/findAll-book.dto";

@Injectable()
export class BookService {

    constructor(private prisma: PrismaService) {}

    healthModule(){
        return {message: "Modulo Books OK!"}
    };

    // CREATE BOOK
    async createBook(dto: CreateBookDto) {
        const { author, editorial, genre, ...bookData } = dto;

        return this.prisma.$transaction(async (tx) => {

            const authorRecord = await tx.author.upsert({
                where: { name: author },
                create: { name: author },
                update: {} 
            });

            const editorialRecord = await tx.editorial.upsert({
                where: { name: editorial },
                create: { name: editorial },
                update: {} 
            });

            const genreRecord = await tx.genre.upsert({
                where: { name: genre },
                create: { name: genre },
                update: {} 
            });

            return tx.book.create({
                data: {
                    ...bookData,
                    authorId: authorRecord.id,
                    editorialId: editorialRecord.id,
                    genreId: genreRecord.id
                },
                include: { author: true, editorial: true, genre: true }
            });
        });
    }
    

    // FIND ALL BOOKS
    async findAllBook(findAllBookDto: FindAllBooksDto){
        const { limit = 1000, offset = 0, title, author, editorial, genre, availability, sortBy, order } = findAllBookDto;

        const where: any = { deletedAt: null };
        
        if (title) where.title = { contains: title, mode: 'insensitive' };
        if (author) where.author = { name: { contains: author, mode: 'insensitive' } };
        if (editorial) where.editorial = { name: { contains: editorial, mode: 'insensitive' } };
        if (genre) where.genre = { name: { contains: genre, mode: 'insensitive' } };
        if (availability !== undefined) where.availability = availability;

        const orderBy = sortBy ? { [sortBy]: order } : { createdAt: 'desc' };
        
        return this.prisma.book.findMany({
            where,
            orderBy: orderBy as any,
            take: limit,
            skip: offset,
            include: { author: true, editorial: true, genre: true }
        } as any);
    };


    // UPDATE BOOK
    async updateBook(id: number, updateBookDto: UpdateBookDto){
        const book = await this.prisma.book.findUnique({
            where: { id }
        });

        if (!book){
            throw new NotFoundException(`No se encontró el libro`);
        }

        const { author, editorial, genre, ...bookData } = updateBookDto;
        const data: any = { ...bookData };

        if (author) {
            data.author = { connectOrCreate: { where: { name: author }, create: { name: author } } };
        }
        if (editorial) {
            data.editorial = { connectOrCreate: { where: { name: editorial }, create: { name: editorial } } };
        }
        if (genre) {
            data.genre = { connectOrCreate: { where: { name: genre }, create: { name: genre } } };
        }

        return await this.prisma.book.update({
            where: { id },
            data: data as any,
            include: { author: true, editorial: true, genre: true }
        } as any);
    };


    // DELETE BOOK
    async removeBook(id: number){
        const book = await this.prisma.book.findUnique({
            where: { id }
        });

        if (!book){
            throw new NotFoundException(`No se encontró el libro`);
        }

        return await this.prisma.book.update({
            where: { id },
            data: { 
                deletedAt: new Date(),
                availability: false
            }
        });
    };


// EXPORT TO CSV
    async exportBooksToCsv(): Promise<string> {

        const books = await this.prisma.book.findMany({
            where: { deletedAt: null },
            include: { 
                author: true, 
                editorial: true, 
                genre: true 
            }
        });

        const header = 'ID,Titulo,Autor,Editorial,Genero,Precio,Disponibilidad\n';
        
        const rows = books.map(book => {
            const title = book.title.replace(/"/g, '""');
            const author = book.author.name.replace(/"/g, '""');
            const editorial = book.editorial.name.replace(/"/g, '""');
            const genre = book.genre.name.replace(/"/g, '""');
            const availability = book.availability ? 'Si' : 'No';

            return `${book.id},"${title}","${author}","${editorial}","${genre}",${book.price},"${availability}"`;
        }).join('\n');

        return header + rows;
    }
}