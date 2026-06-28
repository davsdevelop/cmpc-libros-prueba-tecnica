import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationGuard } from '../../../../../src/modules/iam/authentication/guards/authentication.guard';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from '../../../../../src/modules/iam/authentication/guards/access-token.guard';
import { UnauthorizedException } from '@nestjs/common';
import { AuthType } from '../../../../../src/modules/iam/authentication/enums/auth-type.enums';

describe('AuthenticationGuard', () => {
  let guard: AuthenticationGuard;
  let reflector: Reflector;
  let accessTokenGuard: AccessTokenGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationGuard,
        { provide: Reflector, useValue: { getAllAndOverride: jest.fn() } },
        { provide: AccessTokenGuard, useValue: { canActivate: jest.fn() } },
      ],
    }).compile();

    guard = module.get<AuthenticationGuard>(AuthenticationGuard);
    reflector = module.get<Reflector>(Reflector);
    accessTokenGuard = module.get<AccessTokenGuard>(AccessTokenGuard);
  });

  it('debería permitir el acceso si el tipo de Auth es "None" (Ruta pública)', async () => {

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([AuthType.None]);
    
    const context = { getHandler: jest.fn(), getClass: jest.fn() };
    const result = await guard.canActivate(context as any);

    expect(result).toBe(true);
  });

  it('debería delegar la validación al AccessTokenGuard si el tipo es "Bearer"', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([AuthType.Bearer]);

    jest.spyOn(accessTokenGuard, 'canActivate').mockResolvedValue(true);
    
    const context = { getHandler: jest.fn(), getClass: jest.fn() };
    const result = await guard.canActivate(context as any);

    expect(result).toBe(true);
    expect(accessTokenGuard.canActivate).toHaveBeenCalled();
  });

  it('debería lanzar la excepción propagada si el AccessTokenGuard falla', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([AuthType.Bearer]);
    jest.spyOn(accessTokenGuard, 'canActivate').mockRejectedValue(new UnauthorizedException());
    
    const context = { getHandler: jest.fn(), getClass: jest.fn() };

    await expect(guard.canActivate(context as any)).rejects.toThrow(UnauthorizedException);
  });
});