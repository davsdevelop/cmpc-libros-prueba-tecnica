import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from '../../../../src/modules/iam/authentication/authentication.controller';
import { AuthenticationService } from '../../../../src/modules/iam/authentication/authentication.service';


describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let service: AuthenticationService;

  const mockAuthService = {
    Register: jest.fn().mockResolvedValue({ id: 1, email: 'test@test.com' }),
    login: jest.fn().mockResolvedValue({ message: 'Login Correcto!', token: 'jwt-token' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [{ provide: AuthenticationService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('registerUser debería llamar al servicio de registro', async () => {
    const dto = { email: 'test@test.com', password: '123' };
    expect(await controller.registerUser(dto)).toEqual({ id: 1, email: 'test@test.com' });
    expect(service.Register).toHaveBeenCalledWith(dto);
  });

  it('loginUser debería llamar al servicio de login', async () => {
    const dto = { email: 'test@test.com', password: '123' };
    expect(await controller.loginUser(dto)).toEqual({ message: 'Login Correcto!', token: 'jwt-token' });
    expect(service.login).toHaveBeenCalledWith(dto);
  });
});