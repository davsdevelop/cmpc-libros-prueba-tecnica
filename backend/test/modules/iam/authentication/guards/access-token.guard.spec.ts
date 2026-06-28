import { Test, TestingModule } from '@nestjs/testing';
import { AccessTokenGuard } from '../../../../../src/modules/iam/authentication/guards/access-token.guard';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import jwtConfig from '../../../../../src/config/security/jwt.config';

describe('AccessTokenGuard', () => {
  let guard: AccessTokenGuard;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessTokenGuard,
        { provide: JwtService, useValue: { verifyAsync: jest.fn() } },
        { provide: jwtConfig.KEY, useValue: { secret: 'secret' } },
      ],
    }).compile();

    guard = module.get<AccessTokenGuard>(AccessTokenGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('debería lanzar UnauthorizedException si no hay token en el header', async () => {

    const mockContext = {
      switchToHttp: () => ({ getRequest: () => ({ headers: {} }) }),
    };

    await expect(guard.canActivate(mockContext as any)).rejects.toThrow(UnauthorizedException);
  });

  it('debería retornar true y adjuntar el payload al request si el token es válido', async () => {
    const mockRequest = { headers: { authorization: 'Bearer validToken' } };
    const mockContext = {
      switchToHttp: () => ({ getRequest: () => mockRequest }),
    };


    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ id: 1, email: 'test@test.com' });

    const result = await guard.canActivate(mockContext as any);

    expect(result).toBe(true);
    expect(mockRequest['user']).toBeDefined(); 
  });

  it('debería lanzar UnauthorizedException si el token expira o es inválido', async () => {
    const mockContext = {
      switchToHttp: () => ({ getRequest: () => ({ headers: { authorization: 'Bearer badToken' } }) }),
    };

    jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error('Token Expired'));

    await expect(guard.canActivate(mockContext as any)).rejects.toThrow(UnauthorizedException);
  });
});