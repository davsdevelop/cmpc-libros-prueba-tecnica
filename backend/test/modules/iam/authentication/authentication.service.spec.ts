import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import jwtConfig from '../../../../src/config/security/jwt.config';
import { AuthenticationService } from '../../../../src/modules/iam/authentication/authentication.service';
import { PrismaService } from '../../../../src/config/db/prisma.service';
import { HashingService } from '../../../../src/modules/iam/hashing/hashing.service';


describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let prisma: any;
  let hashing: any;
  let jwt: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        { provide: PrismaService, useValue: { user: { findUnique: jest.fn(), create: jest.fn() } } },
        { provide: HashingService, useValue: { hash: jest.fn().mockResolvedValue('hashed'), compare: jest.fn() } },
        { provide: JwtService, useValue: { signAsync: jest.fn().mockResolvedValue('token123') } },
        { provide: jwtConfig.KEY, useValue: { secret: 'secret' } },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    prisma = module.get<PrismaService>(PrismaService);
    hashing = module.get<HashingService>(HashingService);
    jwt = module.get<JwtService>(JwtService);
  });


  it('Register debería fallar si el correo existe', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'test@mail.com' });
    await expect(service.Register({ email: 'test@mail.com', password: '123' })).rejects.toThrow(ConflictException);
  });

  it('Register debería crear un usuario nuevo', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: 1, email: 'new@mail.com' });
    
    const result = await service.Register({ email: 'new@mail.com', password: '123' });
    expect(result.email).toBe('new@mail.com');
  });

  // TEST LOGIN
  it('Login debería fallar si el usuario no existe', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.login({ email: 'test@mail.com', password: '123' })).rejects.toThrow(UnauthorizedException);
  });

  it('Login debería fallar si la contraseña es incorrecta', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, password: 'hashed' });
    hashing.compare.mockResolvedValue(false); 

    await expect(service.login({ email: 'test@mail.com', password: '123' })).rejects.toThrow(UnauthorizedException);
  });

  it('Login debería devolver un token con credenciales correctas', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'test@mail.com', password: 'hashed' });
    hashing.compare.mockResolvedValue(true); 

    const result = await service.login({ email: 'test@mail.com', password: '123' });
    expect(result.token).toBe('token123');
    expect(jwt.signAsync).toHaveBeenCalled();
  });
});