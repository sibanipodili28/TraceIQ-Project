import { Module } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';

const mongoClientProvider = {
  provide: 'MONGO_CLIENT',
  useFactory: async (): Promise<MongoClient> => {
    try {
      const mongoUri = process.env.MONGODB_CONNECTION_STRING;

      if (!mongoUri) {
        throw new Error("MONGODB_CONNECTION_STRING is not defined");
      }

      const client = await MongoClient.connect(mongoUri);
      return client;
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
};

const databaseProvider = {
  provide: 'DATABASE_CONNECTION',
  useFactory: (client: MongoClient): Db => {
    return client.db(process.env.MONGO_DB_DATABASE_NAME);
  },
  inject: ['MONGO_CLIENT'],
};

@Module({
  providers: [databaseProvider, mongoClientProvider],
  exports: ['DATABASE_CONNECTION', 'MONGO_CLIENT'],
})
export class MongoDBModule {}