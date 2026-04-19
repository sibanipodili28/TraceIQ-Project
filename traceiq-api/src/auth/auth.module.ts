import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GithubStrategy } from "../github/github.strategy";
import { JwtStrategy } from "./jwt.strategy";
import { UserModule } from "src/user/user.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GithubService } from "src/github/github.service";
import { RepoService } from "@/repo/repo.service";
import { RepoMapper } from "@/repo/repo.mapper";
import { RepoRepository } from "@/repo/repo.repository";
import { MongoDBModule } from "@/mongoDB/mongodb.module";

@Module({
  imports: [
    PassportModule,
    MongoDBModule,
    JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '1d' },
    }),
    
  }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GithubStrategy,
    JwtStrategy,
    GithubService,
    RepoService,
    RepoMapper,
    {
          provide: "IRepoRepository", 
          useClass: RepoRepository,
        },
  ],
})
export class AuthModule {}