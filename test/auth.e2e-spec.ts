// ========== Auth E2E Spec
// import all modules
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { EncryptionModule } from '../src/encryption/encryption.module';
import { User } from '../src/schemas/user.schema';
import { EncryptionService } from '../src/encryption/encryption.service';
import { IRegisterTest } from '../src/auth/auth.types';

describe('AuthModule (e2e)', () => {
  let app: INestApplication;

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

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        EncryptionModule,
        AuthModule,
      ],
    })
      .overrideProvider(getModelToken(User.name))
      .useValue(modelMock)
      .overrideProvider(EncryptionService)
      .useValue(encryptionServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

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
          _id: expect.any(String),
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
      message: 'shoud return error "Email is required" and "Email is invalid"',
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

  it.each(scenarios)('$message, auth/register (POST)', ({ body, result }) => {
    return request(app.getHttpServer())
      .post('/v1/auth/register')
      .send(body)
      .expect(result.statusCode)
      .then((response) => {
        console.log(response.body);
        expect(response.body).toEqual(result);
      });
  });
});
