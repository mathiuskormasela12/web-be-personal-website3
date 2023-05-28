// ========== Auth Controller Spec
// import all modules
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import mongoose from 'mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { EncryptionService } from '../encryption/encryption.service';
import { IRegisterTest } from './auth.types';
import { RegisterDto } from './dto';

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

  describe('Register User', () => {
    const scenarios: IRegisterTest[] = [
      // Success Scenario (Register Success)
      {
        body: {
          firstName: 'Jhon',
          lastName: 'Doe',
          email: 'jhon@mail.com',
          password: 'Jh0nd03123$',
          repeatPassword: 'Jh0nd03123$',
        },
        message: 'should return a user data',
        result: {
          statusCode: HttpStatus.CREATED,
          data: {
            _id: expect.any(mongoose.Types.ObjectId),
            email: 'jhon@mail.com',
            firstName: 'Jhon',
            lastName: 'Doe',
          },
        },
      },

      // Failed Scenario (Email already in used)
      {
        body: {
          firstName: 'Jhon',
          lastName: 'Doe',
          email: 'jhon123@mail.com',
          password: 'Jh0nd03123$',
          repeatPassword: 'Jh0nd03123$',
        },
        message: `should return error "Account already exist"`,
        result: {
          statusCode: HttpStatus.BAD_REQUEST,
          errors: {
            email: ['Account already exists'],
          },
        },
      },

      // Failed Scenario (Password & Repeat password don't match)
      {
        body: {
          firstName: 'Jhon',
          lastName: 'Doe',
          email: 'jhon@mail.com',
          password: 'Jh0nd03123$',
          repeatPassword: 'Jh0nd03123$1',
        },
        message: `should be return error "Password & repeat password don't match"`,
        result: {
          statusCode: HttpStatus.BAD_REQUEST,
          errors: {
            password: ["Password & repeat password don't match"],
          },
        },
      },
    ];

    it.each(scenarios)('$message', async ({ body, result }) => {
      await expect(authController.register(body as never)).resolves.toEqual(
        result,
      );
    });

    const scenariosWithDto: IRegisterTest[] = [
      // Without First Name Scenario
      {
        body: {
          lastName: 'Doe',
          email: 'jhon@mail.com',
          password: 'Jh0nd03123$',
          repeatPassword: 'Jh0nd03123$',
        },
        message:
          'shoud return error "First name is required" and "First name should be a string"',
        result: {
          statusCode: HttpStatus.BAD_REQUEST,
          errors: {
            firstName: [
              'First name is required',
              'First name should be a string',
            ],
          },
        },
      },

      // Invalid First Name Scenario
      {
        body: {
          firstName: 22929 as never,
          lastName: 'Doe',
          email: 'jhon@mail.com',
          password: 'Jh0nd03123$',
          repeatPassword: 'Jh0nd03123$',
        },
        message: 'shoud return error "First name should be a string"',
        result: {
          statusCode: HttpStatus.BAD_REQUEST,
          errors: {
            firstName: ['First name should be a string'],
          },
        },
      },

      // Invalid Last Name Scenario
      {
        body: {
          firstName: 'Jhon',
          lastName: 12993 as never,
          email: 'jhon@mail.com',
          password: 'Jh0nd03123$',
          repeatPassword: 'Jh0nd03123$',
        },
        message: 'shoud return error "Last name should be a string"',
        result: {
          statusCode: HttpStatus.BAD_REQUEST,
          errors: {
            lastName: ['Last name should be a string'],
          },
        },
      },

      // Without Email Scenario
      {
        body: {
          firstName: 'Jhon',
          lastName: 'Doe',
          password: 'Jh0nd03123$',
          repeatPassword: 'Jh0nd03123$',
        },
        message:
          'shoud return error "Email is required" and "Email is invalid"',
        result: {
          statusCode: HttpStatus.BAD_REQUEST,
          errors: {
            email: ['Email is required', 'Email is invalid'],
          },
        },
      },

      // Invalid Email Scenario
      {
        body: {
          firstName: 'Jhon',
          lastName: 'Doe',
          email: 'jhondoe',
          password: 'Jh0nd03123$',
          repeatPassword: 'Jh0nd03123$',
        },
        message: 'shoud return error "Email is invalid"',
        result: {
          statusCode: HttpStatus.BAD_REQUEST,
          errors: {
            email: ['Email is invalid'],
          },
        },
      },

      // Without Password Scenario
      {
        body: {
          firstName: 'Jhon',
          lastName: 'Doe',
          email: 'jhondoe@gmail.com',
          repeatPassword: 'Jh0nd03123$',
        },
        message:
          'shoud return error "Password is required" and "Password is too weak"',
        result: {
          statusCode: HttpStatus.BAD_REQUEST,
          errors: {
            password: ['Password is required', 'Password is too weak'],
          },
        },
      },

      // Weak Password Scenario
      {
        body: {
          firstName: 'Jhon',
          lastName: 'Doe',
          email: 'jhondoe@gmail.com',
          password: 'jh0nd03123',
          repeatPassword: 'Jh0nd03123$',
        },
        message: 'shoud return error "Password is too weak"',
        result: {
          statusCode: HttpStatus.BAD_REQUEST,
          errors: {
            password: ['Password is too weak'],
          },
        },
      },

      // Without Repeat Password Scenario
      {
        body: {
          firstName: 'Jhon',
          lastName: 'Doe',
          email: 'jhondoe@gmail.com',
          password: 'Jh0nd03123$',
        },
        message:
          'shoud return error "Repeat Password is required" and "Repeat password is too weak"',
        result: {
          statusCode: HttpStatus.BAD_REQUEST,
          errors: {
            repeatPassword: [
              'Repeat password is required',
              'Repeat password is too weak',
            ],
          },
        },
      },

      // Weak Repeat Password Scenario
      {
        body: {
          firstName: 'Jhon',
          lastName: 'Doe',
          email: 'jhondoe@gmail.com',
          password: 'Jh0nd03123$',
          repeatPassword: 'jh0nd03123',
        },
        message: 'shoud return error "Repeat password is too weak"',
        result: {
          statusCode: HttpStatus.BAD_REQUEST,
          errors: {
            repeatPassword: ['Repeat password is too weak'],
          },
        },
      },

      // Without Password & Repeat Password Scenario
      {
        body: {
          firstName: 'Jhon',
          lastName: 'Doe',
          email: 'jhondoe@gmail.com',
        },
        message:
          'shoud return error "Password is required", "Password is too weak",  "Repeat password is required" and "Repeat password is too weak"',
        result: {
          statusCode: HttpStatus.BAD_REQUEST,
          errors: {
            password: ['Password is required', 'Password is too weak'],
            repeatPassword: [
              'Repeat password is required',
              'Repeat password is too weak',
            ],
          },
        },
      },

      // Weak Password & Repeat Password Scenario
      {
        body: {
          firstName: 'Jhon',
          lastName: 'Doe',
          email: 'jhondoe@gmail.com',
          password: 'jh0nd03123',
          repeatPassword: 'jh0nd03123',
        },
        message:
          'shoud return error "Password is too weak" and "Repeat password is too weak"',
        result: {
          statusCode: HttpStatus.BAD_REQUEST,
          errors: {
            password: ['Password is too weak'],
            repeatPassword: ['Repeat password is too weak'],
          },
        },
      },
    ];

    it.each(scenariosWithDto)('$message', async ({ body, result }) => {
      const dto = plainToInstance(RegisterDto, body);
      const errors = await validate(dto);

      const listOfErrors = {};

      for (const error of errors) {
        listOfErrors[error.property] = Object.values(error.constraints);
      }

      expect(listOfErrors).toEqual(result.errors);
    });
  });
});
