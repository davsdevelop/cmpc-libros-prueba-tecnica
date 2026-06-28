import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { HashingService } from '../../../src/modules/iam/hashing/hashing.service';
import { PrismaService } from '../../../src/config/db/prisma.service';
import { UserService } from '../../../src/modules/user/user.service';

describe('UserService', () => {
  let service: UserService;
  let prisma: any;
  let hashService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { 
          provide: PrismaService, 
          useValue: { 
            user: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn(), update: jest.fn() } 
          } 
        },
        { provide: HashingService, useValue: { hash: jest.fn().mockResolvedValue('hashed_password') } },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
    hashService = module.get<HashingService>(HashingService);
  });

  it('healthModule debería retornar OK', () => {
    expect(service.healthModule()).toEqual({ message: "Modulo User OK!" });
  });

  it('debería lanzar ConflictException si el email ya existe', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'test@test.com' });
    await expect(service.createUser({ email: 'test@test.com', password: '123' })).rejects.toThrow(ConflictException);
  });

  it('debería crear un usuario exitosamente', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: 1, email: 'new@test.com', password: 'hashed_password' });

    const result = await service.createUser({ email: 'new@test.com', password: '123' });
    expect(result.email).toBe('new@test.com');
  });

  it('debería devolver todos los usuarios activos', async () => {
    prisma.user.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const result = await service.findAllUser();
    expect(result.length).toBe(2);
  });

  it('debería lanzar NotFoundException si no encuentra el usuario por ID', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.findById(99)).rejects.toThrow(NotFoundException);
  });

  it('debería retornar el usuario si lo encuentra por ID', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1 });
    expect(await service.findById(1)).toEqual({ id: 1 });
  });

  it('debería lanzar NotFoundException al intentar actualizar un usuario que no existe', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.updateUser(99, {})).rejects.toThrow(NotFoundException);
  });

  it('debería actualizar un usuario y encriptar la nueva contraseña', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'old@test.com' });
    prisma.user.update.mockResolvedValue({ id: 1, email: 'new@test.com', password: 'hashed_password' });

    const result = await service.updateUser(1, { email: 'new@test.com', password: 'newpass' });
    expect(result.email).toBe('new@test.com');
    expect(hashService.hash).toHaveBeenCalledWith('newpass');
  });

  it('debería lanzar NotFoundException al intentar eliminar un usuario que no existe', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.removeUser(99)).rejects.toThrow(NotFoundException);
  });

  it('debería hacer soft-delete de un usuario', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1 });
    prisma.user.update.mockResolvedValue({ id: 1, deletedAt: new Date() });

    await service.removeUser(1);
    expect(prisma.user.update).toHaveBeenCalled();
  });
});