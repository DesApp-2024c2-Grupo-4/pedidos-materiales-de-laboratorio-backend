import { ConfigModule, ConfigService } from '@nestjs/config';

const MongooseProvider = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const uri = buildMongoUri(configService);
    console.log({ uri });
    return {
      uri,
    };
  },
  inject: [ConfigService],
};

function buildMongoUri(configService: ConfigService) {
  const host = configService['DB_HOST'] || 'localhost';
  const port = configService['DB_PORT'] || '27017';
  const username = configService['DB_USERNAME'] || 'root';
  const password = configService['DB_PASSWORD'] || 'example';
  const collection = configService['DB_COLLECTION'] || 'lab';
  const authSource = configService['DB_AUTH_SOURCE'] || 'admin';

  return `mongodb://${username}:${password}@${host}:${port}/${collection}?authSource=${authSource}`;
}

export default MongooseProvider;
