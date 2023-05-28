// ========== Auth Schema
// import all modules
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterSuccessResponseSchema {
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

export class RegisterFailedResponseSchema {
  @ApiProperty({
    title: 'Http Status Code',
    type: Number,
    default: 400,
  })
  statusCode: HttpStatus.BAD_REQUEST;

  @ApiProperty({
    title: 'Errors',
    type: Object,
    default: {
      password: ["Password & repeat password don't match"],
    },
  })
  errors: Record<string, string[]>;
}

export class RegisterErrorResponseSchema {
  @ApiProperty({
    title: 'Http Status Code',
    type: Number,
    default: 500,
  })
  statusCode: HttpStatus.INTERNAL_SERVER_ERROR;

  @ApiProperty({
    title: 'Errors',
    type: Object,
    default: {
      system: ['Failed to read key _id'],
    },
  })
  errors: Record<string, string[]>;
}
