// ========== App Module
// import all modules
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { EncryptionModule } from './encryption/encryption.module';

@Module({
  imports: [
    // Setup Config Module
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Setup Rate Limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get<number>('SERVICE_RATE_LIMITER_TTL'),
        limit: configService.get<number>('SERVICE_RATE_LIMITER_LIMIT'),
      }),
      inject: [ConfigService],
    }),

    // Setup Static Files
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      renderPath: '/public',
    }),

    // Setup Database
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get<string>(
          'SERVICE_DB_USER',
        )}:${configService.get<string>(
          'SERVICE_DB_PASSWORD',
        )}@${configService.get<string>(
          'SERVICE_DB_HOST',
        )}:${configService.get<string>('SERVICE_DB_PORT')}`,
        dbName: configService.get<string>('SERVICE_DB_NAME'),
      }),
      inject: [ConfigService],
    }),

    EncryptionModule,
    AuthModule,
  ],
})
export class AppModule {}
