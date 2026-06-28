import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('AppModule', () => {
  it('debería compilar y levantar el módulo raíz con todas sus dependencias', async () => {
    
    process.env.JWT_SECRET = 'test-secret'; 
    
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(module).toBeDefined();
  });
});