import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../../src/modules/user/user.controller';
import { UserService } from '../../../src/modules/user/user.service';


describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    healthModule: jest.fn().mockReturnValue({ message: 'OK' }),
    createUser: jest.fn().mockResolvedValue({ id: 1, email: 'test@test.com' }),
    findAllUser: jest.fn().mockResolvedValue([{ id: 1 }]),
    findById: jest.fn().mockResolvedValue({ id: 1 }),
    updateUser: jest.fn().mockResolvedValue({ id: 1, email: 'updated@test.com' }),
    removeUser: jest.fn().mockResolvedValue({ id: 1, deletedAt: new Date() }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('createUser debería llamar al servicio', async () => {
    const dto = { email: 'test@test.com', password: '123' };
    expect(await controller.createUser(dto)).toEqual({ id: 1, email: 'test@test.com' });
    expect(service.createUser).toHaveBeenCalledWith(dto);
  });

  it('findAllUser debería llamar al servicio', async () => {
    expect(await controller.findAllUser()).toEqual([{ id: 1 }]);
    expect(service.findAllUser).toHaveBeenCalled();
  });

  it('findByTitle (findById) debería llamar al servicio', async () => {
    expect(await controller.findByTitle(1)).toEqual({ id: 1 });
    expect(service.findById).toHaveBeenCalledWith(1);
  });

  it('updateUser y deleteUser deberían llamar al servicio', async () => {
    await controller.updateUser(1, {});
    expect(service.updateUser).toHaveBeenCalledWith(1, {});

    await controller.deleteUser(1);
    expect(service.removeUser).toHaveBeenCalledWith(1);
  });
});