import { ConfigModule, ConfigService } from '@nestjs/config';

const MongooseProvider = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    uri: buildMongoUri(configService),
  }),
  inject: [ConfigService],
};

function buildMongoUri(configService: ConfigService) {
  const host = configService.get<string>('DB_HOST') || 'localhost';
  const port = configService.get<string>('DB_PORT') || '27017';
  const username = configService.get<string>('DB_USERNAME') || 'root';
  const password = configService.get<string>('DB_PASSWORD') || 'example';
  const collection = configService.get<string>('DB_COLLECTION') || 'lab';
  const authSource = configService.get<string>('DB_AUTH_SOURCE') || 'admin';
  const replicaSetInstances = configService.get<string>('DB_REPLICASET');
  const replicaSet = replicaSetInstances
    ? `&replicaSet=${replicaSetInstances}`
    : '';

  return `mongodb://${username}:${password}@${host}:${port}/${collection}?authSource=${authSource}${replicaSet}`;
}

export default MongooseProvider;
