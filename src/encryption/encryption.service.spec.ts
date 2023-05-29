// ========== Encryption Service Spec
// import all modules
import { TestingModule, Test } from '@nestjs/testing';
import { EncryptionService } from './encryption.service';
import { ConfigService } from '@nestjs/config';

describe('EncryptionService', () => {
  let encryptionService: EncryptionService;

  beforeEach(async () => {
    const configServiceMock = {
      get: jest
        .fn()
        .mockReturnValueOnce('qwertyyuop123456790d-djdlam29syd')
        .mockReturnValue('qazwsxedcrfvtgby'),
    };

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
        EncryptionService,
      ],
    }).compile();

    encryptionService = app.get<EncryptionService>(EncryptionService);
  });

  it('should encrypt the string', () => {
    const encryptedText = encryptionService.encrypt('Jhon Doe');
    expect(encryptedText).toBe(
      encryptionService.encrypt(encryptionService.decrypt(encryptedText)),
    );
  });

  it('should decrypt the string', () => {
    const encryptedText = encryptionService.encrypt('Jhon Doe');
    const decryptedText = encryptionService.decrypt(encryptedText);
    expect(decryptedText).toBe(encryptionService.decrypt(encryptedText));
  });
});
