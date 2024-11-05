import { Test, TestingModule } from '@nestjs/testing';
import { UserInitService } from '../user-init.service';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { User } from '../../../schemas/user.schema';

describe('UserInitService', () => {
  let service: UserInitService;
  let userModel: Model<User>;
  let configService: ConfigService;

  const mockUserModel = {
    countDocuments: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    create: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserInitService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<UserInitService>(UserInitService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    configService = module.get<ConfigService>(ConfigService);

    jest.clearAllMocks();
  });

  it('should not create an admin user if CREATE_DEFAULT_ADMIN is false', async () => {
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'CREATE_DEFAULT_ADMIN') return 'false';
      return null;
    });

    await service.onModuleInit();

    expect(userModel.countDocuments).not.toHaveBeenCalled();
    expect(userModel.create).not.toHaveBeenCalled();
  });

  it('should not create an admin user if users already exist', async () => {
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'CREATE_DEFAULT_ADMIN') return 'true';
      return null;
    });

    mockUserModel.exec.mockResolvedValueOnce(1);

    await service.onModuleInit();

    expect(userModel.countDocuments).toHaveBeenCalled();
    expect(userModel.create).not.toHaveBeenCalled();
  });

  it('should create an admin user if no users exist and CREATE_DEFAULT_ADMIN is true', async () => {
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'CREATE_DEFAULT_ADMIN') return 'true';
      if (key === 'DEFAULT_ADMIN_ROLES') return 'admin;lab';
      if (key === 'DEFAULT_ADMIN_EMAIL') return 'admin@example.com';
      if (key === 'DEFAULT_ADMIN_PASSWORD') return 'example';
      if (key === 'DEFAULT_ADMIN_NAME') return 'Admin';
      if (key === 'DEFAULT_ADMIN_LASTNAME') return 'User';
      if (key === 'DEFAULT_ADMIN_DNI') return '12345678';
      return null;
    });

    mockUserModel.exec.mockResolvedValueOnce(0);

    const mockAdminUser = {
      email: 'admin@example.com',
      password: 'example',
      name: 'Admin',
      lastName: 'User',
      dni: 12345678,
      roles: ['admin', 'lab'],
    };

    mockUserModel.create.mockResolvedValueOnce(mockAdminUser);

    await service.onModuleInit();

    expect(userModel.countDocuments).toHaveBeenCalled();
    expect(userModel.create).toHaveBeenCalledWith(mockAdminUser);
  });

  it('should throw an error if admin user creation fails', async () => {
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'CREATE_DEFAULT_ADMIN') return 'true';
      if (key === 'DEFAULT_ADMIN_EMAIL') return 'admin@example.com';
      return null;
    });

    mockUserModel.exec.mockResolvedValueOnce(0);

    const createError = new Error('Create error');
    mockUserModel.create.mockRejectedValueOnce(createError);

    await expect(service.onModuleInit()).rejects.toThrow(
      `Cannot create admin user null. Reason: ${createError}`,
    );

    expect(userModel.countDocuments).toHaveBeenCalled();
    expect(userModel.create).toHaveBeenCalled();
  });

  it('should create a default admin user with default values if config values are missing', async () => {
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'CREATE_DEFAULT_ADMIN') return 'true';
      return null;
    });

    mockUserModel.countDocuments.mockReturnValueOnce(mockUserModel);
    mockUserModel.exec.mockResolvedValueOnce(0);

    const defaultAdminUser = {
      email: 'admin@example.com',
      password: 'example',
      name: 'Admin',
      lastName: 'User',
      dni: 12345678,
      roles: ['admin', 'lab'],
    };

    mockUserModel.create.mockResolvedValueOnce(defaultAdminUser);

    await service.onModuleInit();

    expect(userModel.countDocuments).toHaveBeenCalled();
    expect(userModel.create).toHaveBeenCalledWith(defaultAdminUser);
  });
});
