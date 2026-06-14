import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongoDBModule } from './mongoDB/mongodb.module';
import { RepoModule } from './repo/repo.module';
import { AnalyseModule } from './analyse/analyse.module';
// import { GithubModule } from './github/github.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongoDBModule,

    AuthModule,
    UserModule,
    RepoModule,
    AnalyseModule,
  ],
})
export class AppModule {}