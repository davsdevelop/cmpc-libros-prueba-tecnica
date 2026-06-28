import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from '../../../../src/modules/iam/hashing/bcrypt.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('BcryptService', () => {
  let service: BcryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptService],
    }).compile();

    service = module.get<BcryptService>(BcryptService);
  });

  it('debería generar un salt y encriptar la contraseña', async () => {

    (bcrypt.genSalt as jest.Mock).mockResolvedValue('randomSalt');
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

    const result = await service.hash('miPassword123');

    expect(bcrypt.genSalt).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith('miPassword123', 'randomSalt');
    expect(result).toBe('hashedPassword');
  });

  it('debería comparar exitosamente una contraseña con su hash', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await service.compare('miPassword123', 'hashedPassword');

    expect(bcrypt.compare).toHaveBeenCalledWith('miPassword123', 'hashedPassword');
    expect(result).toBe(true);
  });
});