import { Inject, Injectable } from "@nestjs/common";
import simpleGit from "simple-git";
import { IRepoRepository } from "./interfaces/repo.interface";
import { Collection, Db } from "mongodb";
import { REPO_STATUS } from "./constants/status";
import { Repo } from "./repo.model";
import { RepoDto } from "./dtos/request/repos.request.dto";

@Injectable()
export class RepoRepository implements IRepoRepository {
  private git = simpleGit();
   private collection: Collection<any>;
  constructor(
    @Inject("DATABASE_CONNECTION") private db: Db) {
    this.collection = this.db.collection("repositories");
  }

  async getRepos(userId: string): Promise<RepoDto[]> {
    console.log("Fetching repos for user:", userId);
    const filter = {
      gitUserId: userId,
      isActiveVersion: true,
      isDeleted: false,
    };
    const projection = {
      githubRepoId: 1,
      gitUserId: 1,
      fullName: 1,
      branches:1
    }
    const result=await this.collection.find(filter,{projection}).toArray();
    return result;
  }

  async fetchRepo(userId: string,repoId:string): Promise<any> {
    console.log("Fetching repos for user:", userId);
    const filter = {
      gitUserId: userId,
      githubRepoId: repoId,
      isActiveVersion: true,
      isDeleted: false,
    };
    const projection = {
      githubRepoId: 1,
      gitUserId: 1,
      fullName: 1,
      branches:1
    }
    const result= this.collection.find(filter,{projection});
    return result;
  }

  async cloneRepo(cloneUrl: string): Promise<any> {
    try {
      const repoName = cloneUrl.split("/").pop()?.replace(".git", "");
      await this.git.clone(cloneUrl, `repos/${repoName}`);
      return {
        message: "Repository cloned successfully",
        repoName,
      };
    } catch (error) {
      console.error("Clone error:", error);
      throw new Error("Failed to clone repository");
    }
  }

  async saveRepo(repo:Repo): Promise<{status: string}> {
    const filter = {
      githubRepoId: repo.githubRepoId,
      gitUserId: repo.gitUserId,
      isDeleted: false,
      isActiveVersion: true,
      }; 
    let branchesUpdate=false;
     const existing = await this.collection.findOne(filter);

        if(existing ){
          const { branches, hasChanges } = this._mergeBranches(
            existing.branches || [],
            repo.branches|| [],
          );
         repo.branches = branches;
         branchesUpdate=hasChanges;
        }

        if (!existing) {
          await this.collection.insertOne({
            ...repo,
            version: 1,
            isActiveVersion: true,
            isDeleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          }); 
          return{
            status: REPO_STATUS.INSERTED,
          }
        }
        else if (existing.hashCode === repo.hashCode && !branchesUpdate) {
          return{
            status: REPO_STATUS.SKIPPED,
          }
        }
        else {
          await this.collection.updateOne(
            filter,
            {
              $set: {
                isActiveVersion: false,
                updatedAt: new Date(),
              },
            }
          );
  
          await this.collection.insertOne({
            ...repo,
            version: (existing.version || 1) + 1,
            isActiveVersion: true,
            isDeleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          return{
            status: REPO_STATUS.UPDATED,
          }
        }
    }

    async userRepoExist(userId: string): Promise<boolean> {
      const filter = {
        gitUserId: userId,
        isDeleted: false,
        isActiveVersion: true,
      };
      const count = await this.collection.countDocuments(filter);
      return count > 0;
    }

    _mergeBranches = (
  existingBranches: any[] = [],
  newBranches: any[]
): { branches: any[]; hasChanges: boolean } => {
  const existingMap = new Map(
    existingBranches.map((b) => [b.name.toLowerCase(), b])
  );
  let hasChanges = false;
  const mergedBranches = newBranches.map((branch: any) => {
    const name = branch.name;
    const newCommitSha = branch.commit.sha;
    const existing = existingMap.get(name.toLowerCase());
    if (!existing) {
      hasChanges = true;
      return {
        name,
        commitSha: newCommitSha,
        isDefault: branch.isDefault,
        lastAnalyzedSha: "",
      };
    }
    if (existing.commitSha !== newCommitSha) {
      hasChanges = true;
      return {
        ...existing,
        commitSha: newCommitSha,
        isDefault: branch.isDefault,
      };
    }
    return existing;
  });
  if (existingBranches.length !== mergedBranches.length) {
    hasChanges = true;
  }
  return {
    branches: mergedBranches,
    hasChanges,
  };
};

async updateLastAnalyzedSha(repoId: string, branchName: string, sha: string) {
    await this.collection.updateOne(
      {
        githubRepoId: repoId,
        "branches.name": branchName,
      },
      {
        $set: {
          "branches.$.lastAnalyzedSha": sha,
        },
      }
    );
  }
}