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
import { IUser } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly encryptionService: EncryptionService,
  ) {}

  public async register(
    @Body() dto: RegisterDto,
  ): Promise<IResponse<Partial<IUser>>> {
    try {
      const user = await this.userModel
        .findOne({ email: this.encryptionService.encrypt(dto.email) })
        .lean();

      if (!user) {
        const hash = await bcrypt.hash(dto.password, 8);
        const encryptedEmail = this.encryptionService.encrypt(dto.email);
        const encryptedFirstName = this.encryptionService.encrypt(
          dto.firstName,
        );
        const encryptedLastName = this.encryptionService.encrypt(dto.lastName);

        try {
          const result = await this.userModel.create({
            firstName: encryptedFirstName,
            lastName: encryptedLastName,
            email: encryptedEmail,
            password: hash,
          });

          return {
            statusCode: HttpStatus.CREATED,
            data: {
              _id: result._id,
              email: this.encryptionService.decrypt(result.email),
              firstName: this.encryptionService.decrypt(result.firstName),
              lastName: this.encryptionService.decrypt(result.lastName),
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
