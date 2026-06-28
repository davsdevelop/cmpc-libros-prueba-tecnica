import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/config/db/prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debería ejecutar $connect al iniciar el módulo', async () => {
    jest.spyOn(service, '$connect').mockResolvedValue(undefined);
    
    await service.onModuleInit();
    
    expect(service.$connect).toHaveBeenCalled();
  });
});