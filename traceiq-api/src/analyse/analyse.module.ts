import { Module } from "@nestjs/common";
import { GithubService } from "src/github/github.service";
import { MongoDBModule } from "src/mongoDB/mongodb.module";
import { AnalyseRepository } from "./analyse.repository";
import { AnalyseController } from "./analyse.controller";
import { AnalyseService } from "./analyse.service";

@Module({
  imports: [
      MongoDBModule,
    ],
  controllers: [AnalyseController],
  providers: [
    AnalyseService,
    GithubService,
    {
      provide: "IAnalyseRepository", 
      useClass: AnalyseRepository,
    },
  ],
})
export class AnalyseModule {}