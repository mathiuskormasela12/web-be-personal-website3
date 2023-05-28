// ========== Auth Controller Spec
// import all modules
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { EncryptionService } from '../encryption/encryption.service';
import { IRegisterTestData } from './auth.types';
import mongoose from 'mongoose';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const modelMock = {
      findOne: ({ email }: { email: string }) => {
        if (email === 'jhon123@mail.com') {
          return {
            lean: () => ({
              _id: new mongoose.Types.ObjectId(),
              email: 'jhon123@mail.com',
            }),
          };
        } else {
          return {
            lean: () => null,
          };
        }
      },
      create: (data: User) => ({
        _id: new mongoose.Types.ObjectId(),
        ...data,
      }),
    };

    const encryptionServiceMock = {
      encrypt: (value: string) => value,
      decrypt: (value: string) => value,
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: getModelToken(User.name),
          useValue: modelMock,
        },
        {
          provide: EncryptionService,
          useValue: encryptionServiceMock,
        },
        AuthService,
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  describe('Register Method', () => {
    const data: IRegisterTestData<Partial<User>>[] = [
      {
        body: {
          firstName: 'Jhon',
          lastName: 'Doe',
          email: 'jhondoe@mail.com',
          password: 'Jh0nd03123$',
          repeatPassword: 'Jh0nd03123$',
        },
        message: 'should return status code 201 and return user data',
        result: {
          statusCode: 201,
          data: {
            _id: expect.any(mongoose.Types.ObjectId),
            email: expect.any(String),
          },
        },
      },
      {
        body: {
          firstName: 'Jhon',
          lastName: 'Doe',
          email: 'jhondoe@gmail',
          password: 'Jh0nd0e123$',
          repeatPassword: 'Jh0nd0e123$1',
        },
        message: `should return error message "Password & repeat password don't match"`,
        result: {
          statusCode: 400,
          errors: {
            password: ["Password & repeat password don't match"],
          },
        },
      },
      {
        body: {
          email: 'jhon123@mail.com',
          firstName: 'Jhon',
          lastName: 'Doe',
          password: 'ddddkkd9299299929292',
          repeatPassword: 'ddddkkd9299299929292',
        },
        message: `should return error message "Account already exists"`,
        result: {
          statusCode: 400,
          errors: {
            email: ['Account already exists'],
          },
        },
      },
    ];

    it.each(data)('$message', async ({ body, result }) => {
      await expect(authController.register(body)).resolves.toEqual(result);
    });
  });
});
