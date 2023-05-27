// ========== Auth Schema
// import all modules
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class RegisteSuccessResponseSchema {
  @ApiProperty({
    title: 'Http Status Code',
    type: Number,
    default: 201,
  })
  statusCode: HttpStatus.CREATED;

  @ApiProperty({
    title: 'Response Data',
    type: Object,
    default: {
      id: Date.now().toString(),
      name: 'Jhon Doe',
    },
  })
  data: {
    id: string;
    name: string;
  };
}
