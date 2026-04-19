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
    const filter = {
      gitUserId: userId,
      isActiveVersion: true,
      isDeleted: false,
    };
    const result=await this.collection.find(filter).toArray();
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
    const existing = await this.collection.findOne(filter);
        if (!existing) {
          await this.collection.insertOne({
            ...repo,
            version: 1,
            isActiveVersion: true,
            isDeleted: false,
            createdAt: new Date(),
            updatedAtRecord: new Date(),
          }); 
          return{
            status: REPO_STATUS.INSERTED,
          }
        }
        else if (existing.hashCode === repo.hashCode) {
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
                updatedAtRecord: new Date(),
              },
            }
          );
  
          await this.collection.insertOne({
            ...repo,
            version: (existing.version || 1) + 1,
            isActiveVersion: true,
            isDeleted: false,
            createdAt: new Date(),
            updatedAtRecord: new Date(),
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
}