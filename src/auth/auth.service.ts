// ========== Auth Service
// import all modules
import { Body, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { IResponse } from '../types';
import { RegisterDto } from './dto';
import { User } from '../schemas/user.schema';
import { EncryptionService } from '../encryption/encryption.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly encryptionService: EncryptionService,
  ) {}

  public async register(
    @Body() dto: RegisterDto,
  ): Promise<IResponse<Partial<User>>> {
    try {
      const user = await this.userModel
        .findOne({ email: this.encryptionService.encrypt(dto.email) })
        .lean();

      if (!user) {
        const hash = await bcrypt.hash(dto.password, 8);
        const encryptedEmail = this.encryptionService.encrypt(dto.email);

        try {
          const result = await this.userModel.create({
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: encryptedEmail,
            password: hash,
          });

          return {
            statusCode: HttpStatus.CREATED,
            data: {
              _id: result._id,
              email: dto.email,
            },
          };
        } catch (err) {
          return {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            errors: {
              system: [err.message],
            },
          };
        }
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          errors: {
            email: ['Account already exists'],
          },
        };
      }
    } catch (err) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: {
          system: [err.message],
        },
      };
    }
  }
}
