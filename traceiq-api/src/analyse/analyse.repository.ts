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

  async findSummaryAnalysis(userId:string,repoId: string,branchName: string) {
    const filter = {
      gitUserId: userId,
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

  async archiveBranchAnalysis(
  gitUserId: string,
  githubRepoId: string,
  branchName: string
) {
  await this.analysisCollection.updateMany(
    {
      gitUserId,
      githubRepoId,
      branchName,
      isDeleted: false,
      isActiveVersion: true,
    },
    {
      $set: {
        isDeleted: true,
        isActiveVersion: false,
        updatedAt: new Date(),
        updatedBy: gitUserId,
      },
    }
  );
}

async archiveSummaryAnalysis(
  gitUserId: string,
  githubRepoId: string,
  branchName: string
) {
  await this.analysisSummaryCollection.updateMany(
    {
      gitUserId,
      githubRepoId,
      branchName,
      isDeleted: false,
      isActiveVersion: true,
    },
    {
      $set: {
        isDeleted: true,
        isActiveVersion: false,
        updatedAt: new Date(),
        updatedBy: gitUserId,
      },
    }
  );
}

}