// ========== Auth E2E Spec
// import all modules
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';

describe('AuthModule (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/v1/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/v1/auth/register')
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({
          statusCode: 201,
          data: {
            id: expect.any(String),
            name: expect.any(String),
          },
        });
      });
  });
});
