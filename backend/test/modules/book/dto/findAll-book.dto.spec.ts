import 'reflect-metadata'; 
import { FindAllBooksDto } from '../../../../src/modules/book/dto/findAll-book.dto';

describe('FindAllBooksDto', () => {
  it('debería instanciar correctamente el DTO para que Jest lea los decoradores', () => {
    const dto = new FindAllBooksDto();
    expect(dto).toBeDefined();
  });
});