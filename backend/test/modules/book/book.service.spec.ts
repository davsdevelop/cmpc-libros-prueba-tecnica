import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BookService } from '../../../src/modules/book/book.service';
import { PrismaService } from '../../../src/config/db/prisma.service';

describe('BookService', () => {
  let service: BookService;
  let prisma: any;

  const mockPrismaService = {
    $transaction: jest.fn(async (cb) => cb(mockPrismaService)), 
    book: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn()
    },
    author: { upsert: jest.fn() },
    editorial: { upsert: jest.fn() },
    genre: { upsert: jest.fn() }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('healthModule debería retornar OK', () => {
    expect(service.healthModule()).toEqual({ message: "Modulo Books OK!" });
  });

  it('debería crear un libro mediante una transacción atómica', async () => {
    const dto = { title: 'test', author: 'a', editorial: 'e', genre: 'g', price: 10 };
    prisma.author.upsert.mockResolvedValue({ id: 1 });
    prisma.editorial.upsert.mockResolvedValue({ id: 1 });
    prisma.genre.upsert.mockResolvedValue({ id: 1 });
    prisma.book.create.mockResolvedValue({ id: 1, ...dto });

    const result = await service.createBook(dto as any);
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(result.title).toBe('test');
  });

  it('debería listar libros con filtros dinámicos', async () => {
    prisma.book.findMany.mockResolvedValue([]); 
    await service.findAllBook({ title: 'Harry', author: 'Rowling', editorial: 'Salamandra', genre: 'Magia', availability: true } as any);
    expect(prisma.book.findMany).toHaveBeenCalled();
  });

  it('debería lanzar NotFoundException si se actualiza un libro que no existe', async () => {
    prisma.book.findUnique.mockResolvedValue(null);
    await expect(service.updateBook(99, {})).rejects.toThrow(NotFoundException);
  });

  it('debería actualizar relaciones (author, editorial, genre) de un libro existente', async () => {
    prisma.book.findUnique.mockResolvedValue({ id: 1 });
    prisma.book.update.mockResolvedValue({ id: 1, title: 'Updated' });

    const dto = { title: 'Updated', author: 'New', editorial: 'New', genre: 'New' };
    const result = await service.updateBook(1, dto as any);
    
    expect(prisma.book.update).toHaveBeenCalled();
    expect(result.title).toBe('Updated');
  });

  it('debería lanzar NotFoundException al intentar eliminar un libro que no existe', async () => {
    prisma.book.findUnique.mockResolvedValue(null);
    await expect(service.removeBook(99)).rejects.toThrow(NotFoundException);
  });

  it('debería hacer soft-delete y cambiar disponibilidad a false', async () => {
    prisma.book.findUnique.mockResolvedValue({ id: 1 });
    prisma.book.update.mockResolvedValue({ id: 1 });

    await service.removeBook(1);
    expect(prisma.book.update).toHaveBeenCalled();
  });

  it('debería exportar los libros a formato CSV', async () => {
    const mockBooks = [
      {
        id: 1, title: 'El Quijote', price: 15000, availability: true,
        author: { name: 'Cervantes' }, editorial: { name: 'Planeta' }, genre: { name: 'Novela' }
      }
    ];
    prisma.book.findMany.mockResolvedValue(mockBooks);

    const csvData = await service.exportBooksToCsv();
    expect(csvData).toContain('ID,Titulo,Autor,Editorial,Genero,Precio,Disponibilidad');
    expect(csvData).toContain('1,"El Quijote","Cervantes","Planeta","Novela",15000,"Si"');
  });
});