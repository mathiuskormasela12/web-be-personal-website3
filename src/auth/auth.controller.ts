// ========== Auth Controller
// import all modules
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IResponse } from '../types';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisteSuccessResponseSchema } from './auth.schema';
import { RegisterDto } from './dto';
import { User } from '../schemas/user.schema';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: RegisteSuccessResponseSchema,
  })
  public async register(
    @Body() dto: RegisterDto,
  ): Promise<IResponse<Partial<User>>> {
    if (dto.password !== dto.repeatPassword) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        errors: {
          password: ["Password & repeat password don't match"],
        },
      };
    }

    return await this.authService.register(dto);
  }
}
