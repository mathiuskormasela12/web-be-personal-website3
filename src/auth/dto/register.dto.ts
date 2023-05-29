// ========== Register Dto
// import all modules
import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsStrongPassword,
} from 'class-validator';

export class RegisterDto {
	@ApiProperty({
		title: 'First Name',
		type: String,
		default: 'jhon',
		required: true,
	})
	@IsString({ message: 'First name should be a string' })
	@IsNotEmpty({ message: 'First name is required' })
	firstName: string;

	@ApiProperty({
		title: 'Last Name',
		type: String,
		default: 'doe',
		required: false,
	})
	@IsString({ message: 'Last name should be a string' })
	@IsOptional()
	lastName: string;

	@ApiProperty({
		title: 'Email',
		type: String,
		default: 'jhondoe@mail.com',
		required: true,
	})
	@IsEmail({}, { message: 'Email is invalid' })
	@IsNotEmpty({ message: 'Email is required' })
	email: string;

	@ApiProperty({
		title: 'Password',
		type: String,
		default: 'Jh0nd03$',
		required: true,
	})
	@IsStrongPassword({ minLength: 5 }, { message: 'Password is too weak' })
	@IsNotEmpty({ message: 'Password is required' })
	password: string;

	@ApiProperty({
		title: 'Repeat Password',
		type: String,
		default: 'Jh0nd03$',
		required: true,
	})
	@IsStrongPassword(
		{ minLength: 5 },
		{ message: 'Repeat password is too weak' },
	)
	@IsNotEmpty({ message: 'Repeat password is required' })
	repeatPassword: string;
}
