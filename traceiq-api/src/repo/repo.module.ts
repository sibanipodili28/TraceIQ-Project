import { Module } from "@nestjs/common";
import { RepoController } from "./repo.controller";
import { RepoService } from "./repo.service";
import { RepoRepository } from "./repo.repository";
import { GithubService } from "src/github/github.service";
import { RepoMapper } from "./repo.mapper";
import { UserService } from "src/user/user.service";
import { UserRepository } from "src/user/user.repository";
import { MongoDBModule } from "src/mongoDB/mongodb.module";

@Module({
  imports: [
      MongoDBModule,
    ],
  controllers: [RepoController],
  providers: [
    UserService,
    RepoService,
    GithubService,
    RepoMapper,
    {
      provide: "IRepoRepository", 
      useClass: RepoRepository,
    },
    {
      provide: "IUserRepository", 
      useClass: UserRepository,
    },
  ],
})
export class RepoModule {}