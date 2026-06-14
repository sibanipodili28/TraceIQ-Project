import { Module } from "@nestjs/common";
import { GithubService } from "src/github/github.service";
import { MongoDBModule } from "src/mongoDB/mongodb.module";
import { AnalyseRepository } from "./analyse.repository";
import { AnalyseController } from "./analyse.controller";
import { AnalyseService } from "./analyse.service";
import { AnalysisMapper } from "./analysis.mapper";
import { RepoRepository } from "@/repo/repo.repository";
import { UserService } from "@/user/user.service";
import { UserRepository } from "@/user/user.repository";

@Module({
  imports: [
      MongoDBModule,
    ],
  controllers: [AnalyseController],
  providers: [
    AnalyseService,
    AnalysisMapper,
    UserService,
    GithubService,
    {
      provide: "IAnalyseRepository", 
      useClass: AnalyseRepository,
    },
    {
      provide: "IRepoRepository", 
      useClass: RepoRepository,
    },
    {
      provide: "IUserRepository", 
      useClass: UserRepository,
    }
  ],
})
export class AnalyseModule {}