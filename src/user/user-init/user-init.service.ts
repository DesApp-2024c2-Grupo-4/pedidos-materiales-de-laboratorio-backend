import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import handlePromise from '../../utils/promise';

@Injectable()
export class UserInitService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    if (
      this.configService
        .get<string>('CREATE_DEFAULT_ADMIN')
        ?.toLocaleLowerCase() !== 'true'
    ) {
      return;
    }

    const userCount = await this.userModel.countDocuments().exec();

    if (userCount === 0) {
      console.warn('No user accounts detected, creating default admin user.');

      const envRoles = this.configService.get<string>('DEFAULT_ADMIN_ROLE');
      const role: string[] = envRoles ? envRoles.split(';') : ['admin', 'lab'];
      const email =
        this.configService.get<string>('DEFAULT_ADMIN_EMAIL') ||
        'admin@example.com';
      const password =
        this.configService.get<string>('DEFAULT_ADMIN_PASSWORD') || 'example';
      const name =
        this.configService.get<string>('DEFAULT_ADMIN_NAME') || 'Admin';
      const lastName =
        this.configService.get<string>('DEFAULT_ADMIN_LASTNAME') || 'User';
      const dni = parseInt(
        this.configService.get<string>('DEFAULT_ADMIN_DNI') || '12345678',
        10,
      );

      const [admin, err] = await handlePromise(
        this.userModel.create({
          email,
          password,
          name,
          lastName,
          dni,
          role,
        }),
      );

      if (err) {
        throw new Error(`Cannot create admin user ${admin}. Reason: ${err}`);
      }

      console.warn(`Default admin user ${email} created.`);
    }
  }
}
