// ========== Auth Controller Spec
// import all modules
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  describe('Register Method', () => {
    it('should return a user object', () => {
      expect(authController.register().data).toEqual({
        id: expect.any(String),
        name: expect.any(String),
      });
    });
  });
});
