import { Test, TestingModule } from '@nestjs/testing';
import { IamModule } from '../../../src/modules/iam/iam.module';

describe('IamModule', () => {
  it('debería compilar el módulo de autenticación y sus configuraciones', async () => {
    process.env.JWT_SECRET = 'test-secret';
    
    const module: TestingModule = await Test.createTestingModule({
      imports: [IamModule],
    }).compile();

    expect(module).toBeDefined();
  });
});