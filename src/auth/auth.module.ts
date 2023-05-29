// ========== Auth Module
// import all modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from '../schemas/user.schema';
import { ValidationPipe } from '../pipes/validation.pipe';
import { TransformInterceptor } from '../interceptors/transform.interceptor';

@Module({
	imports: [
		// Import mongoose models
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
	],
	controllers: [AuthController],
	providers: [
		// Binding Transform Interceptor
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformInterceptor,
		},

		// Binding Validation Pipe
		{
			provide: APP_PIPE,
			useClass: ValidationPipe,
		},

		// Define Providers
		AuthService,
	],
})
export class AuthModule {}
