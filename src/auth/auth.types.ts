// ========== Auth Types
// import all modules
import { RegisterDto } from './dto';
import { HttpStatus } from '@nestjs/common';

export interface IRegisterTestData<T> {
  body: RegisterDto;
  message: string;
  result: {
    statusCode: HttpStatus;
    data?: T | T[];
    errors?: Record<string, string[]>;
  };
}
