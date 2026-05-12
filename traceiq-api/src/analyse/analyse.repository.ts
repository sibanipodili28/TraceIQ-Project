import { Injectable, Inject } from "@nestjs/common";
import { Db, Collection } from "mongodb";
import { IAnalyseRepository } from "./analyse.interface";

@Injectable()
export class AnalyseRepository implements IAnalyseRepository {
  private analysisCollection: Collection;
  private analysisSummaryCollection: Collection;

  constructor(@Inject("DATABASE_CONNECTION") private db: Db) {
    this.analysisCollection = db.collection("analysis");
    this.analysisSummaryCollection = db.collection("analysis-summary");
  }

  async findSummaryAnalysis(repoId: string,branchName: string) {
    const filter = {
      githubRepoId: repoId,
      branchName,
      isActiverVersion: true,
      isDeleted: false,
    };
    return this.analysisSummaryCollection.findOne(filter);
  }

  async findBranchAnalysisFiles(gitUserId:string,repoId: string,branchName: string) {
    const filter = {
      gitUserId,
      githubRepoId: repoId,
      branchName,
      isActiverVersion: true,
      isDeleted: false,
    };
    return this.analysisSummaryCollection.find(filter).toArray();
  }

  async saveAnalysis(data: any[]) {
    if (data.length) {
      await this.analysisCollection.insertMany(data);
    }
  }
  async saveSummaryAnalysis(data: any) {
      await this.analysisSummaryCollection.insertOne(data);
  }
}