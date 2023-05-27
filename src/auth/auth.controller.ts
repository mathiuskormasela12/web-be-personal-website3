// ========== Auth Controller
// import all modules
import { Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IResponse } from '../types';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisteSuccessResponseSchema } from './auth.schema';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: RegisteSuccessResponseSchema,
  })
  public register(): IResponse<{ id: string; name: string }> {
    return this.authService.register();
  }
}
