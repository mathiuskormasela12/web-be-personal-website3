// ========== Auth Service
// import all modules
import { HttpStatus, Injectable } from '@nestjs/common';
import { IResponse } from '../types';

@Injectable()
export class AuthService {
  public register(): IResponse<{ id: string; name: string }> {
    return {
      statusCode: HttpStatus.CREATED,
      data: {
        id: Date.now().toString(),
        name: 'Mathius',
      },
    };
  }
}
