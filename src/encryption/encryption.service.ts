// ========== Encryption Service
// import all modules
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv } from 'crypto';

@Injectable()
export class EncryptionService {
  private secretKey: string;
  private iv: string;

  constructor(private readonly configService: ConfigService) {
    this.secretKey = this.configService.get<string>('SERVICE_SECRET_KEY');
    this.iv = this.configService.get<string>('SERVICE_SECRET_IV');
  }

  public encrypt(textToEncrypt: string): string {
    const cipher = createCipheriv('aes-256-ctr', this.secretKey, this.iv);

    const encryptedText = Buffer.concat([
      cipher.update(textToEncrypt),
      cipher.final(),
    ]);

    return encryptedText.toString('hex');
  }

  public decrypt(encryptedText: string): string {
    const decipher = createDecipheriv('aes-256-ctr', this.secretKey, this.iv);
    const decryptedText = Buffer.concat([
      decipher.update(Buffer.from(encryptedText, 'hex')),
      decipher.final(),
    ]);

    return decryptedText.toString();
  }
}
