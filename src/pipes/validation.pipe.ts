// ========== Validation Pipe
// import all modules
import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const errorsList: Record<string, string[]> = {};

      for (const error of errors) {
        errorsList[error.property] = Object.values(error.constraints);
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          errors: errorsList,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return value;
  }

  public toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
