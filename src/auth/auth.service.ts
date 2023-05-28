// ========== Auth Service
// import all modules
import { Body, HttpStatus, Injectable } from '@nestjs/common';
import { IResponse } from '../types';
import { RegisterDto } from './dto';

@Injectable()
export class AuthService {
  public register(
    @Body() dto: RegisterDto,
  ): IResponse<{ id: string; name: string }> {
    return {
      statusCode: HttpStatus.CREATED,
      data: {
        id: Date.now().toString(),
        name: `${dto.firstName} ${dto.lastName || ''}`,
      },
    };
  }
}
