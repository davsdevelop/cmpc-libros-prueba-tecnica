import { Test, TestingModule } from '@nestjs/testing';

import { Response } from 'express';
import { BookController } from '../../../src/modules/book/book.controller';
import { BookService } from '../../../src/modules/book/book.service';

describe('BookController', () => {
  let controller: BookController;
  let service: BookService;

  // Mock del servicio de libros
  const mockBookService = {
    healthModule: jest.fn().mockReturnValue({ message: 'OK' }),
    createBook: jest.fn().mockResolvedValue({ id: 1, title: 'Test Book' }),
    findAllBook: jest.fn().mockResolvedValue([{ id: 1, title: 'Test Book' }]),
    updateBook: jest.fn().mockResolvedValue({ id: 1, title: 'Updated Book' }),
    removeBook: jest.fn().mockResolvedValue({ id: 1, deletedAt: new Date() }),
    exportBooksToCsv: jest.fn().mockResolvedValue('ID,Titulo\n1,Test Book'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        { provide: BookService, useValue: mockBookService },
      ],
    }).compile();

    controller = module.get<BookController>(BookController);
    service = module.get<BookService>(BookService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('createBook debería llamar al servicio', async () => {
    const dto = { title: 'Test Book', author: 'A', editorial: 'E', genre: 'G', price: 10 };
    expect(await controller.createBook(dto as any)).toEqual({ id: 1, title: 'Test Book' });
    expect(service.createBook).toHaveBeenCalledWith(dto);
  });

  it('findAllBooks debería llamar al servicio', async () => {
    expect(await controller.findAllBooks({})).toEqual([{ id: 1, title: 'Test Book' }]);
    expect(service.findAllBook).toHaveBeenCalled();
  });

  it('updateBook debería llamar al servicio', async () => {
    expect(await controller.updateBook(1, {})).toEqual({ id: 1, title: 'Updated Book' });
    expect(service.updateBook).toHaveBeenCalledWith(1, {});
  });

  it('deleteBook debería llamar al servicio', async () => {
    await controller.deleteBook(1);
    expect(service.removeBook).toHaveBeenCalledWith(1);
  });

  it('exportCsv debería configurar los headers y enviar el archivo', async () => {

    const mockRes = {
      header: jest.fn(),
      attachment: jest.fn(),
      send: jest.fn(),
    } as unknown as Response;

    await controller.exportCsv(mockRes);

    expect(service.exportBooksToCsv).toHaveBeenCalled();
    expect(mockRes.header).toHaveBeenCalledWith('Content-Type', 'text/csv');
    expect(mockRes.attachment).toHaveBeenCalledWith('libros_cmpc.csv');
    expect(mockRes.send).toHaveBeenCalledWith('ID,Titulo\n1,Test Book');
  });
});