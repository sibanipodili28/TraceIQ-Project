import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { IRepoRepository } from "./interfaces/repo.interface";
import { UserService } from "src/user/user.service";
import { User } from "src/user/user.model";
import { CustomException } from "src/common/exceptions/custom-exceptions";
import { Exception_Messages } from "src/common/constants/messages";
import { GithubService } from "src/github/github.service";
import { RepoMapper } from "./repo.mapper";
import { REPO_STATUS } from "./constants/status";
import { Response_Messages } from "./constants/message";

type RepoCount = {
  userId: string;
  count: number;
};


@Injectable()
export class RepoService {
  constructor(
    @Inject("IRepoRepository")
    private repoRepository: IRepoRepository,
    private userService: UserService,
    private githubService: GithubService,
    private repoMapper: RepoMapper,
  ) {}

  async getRepos(userId: string) {
    return this.repoRepository.getRepos(userId);
  }

  async cloneGithubRepo(cloneUrl: string) {
    return this.repoRepository.cloneRepo(cloneUrl);
  }

  async syncRepos(gitUserId: string) {
        const users = await this.userService.getUsers(gitUserId);
        if (!users.length) {
          throw new CustomException(Exception_Messages?.USER_NOT_FOUND,HttpStatus.NOT_FOUND);
        }
      let results: {
        totalRepos: RepoCount[];
        inserted: number;
        updated: number;
        skipped: number;
      } = {
        totalRepos: [],
        inserted: 0,
        updated: 0,
        skipped: 0,
      };
      for (const user of users) {
        const userRepos = await this.githubService.fetchRepos( user.accessToken);
        const mappedRepos=this.repoMapper._githubReposMapper(userRepos, user.gitUserId);
        results.totalRepos?.push({userId:user.gitUserId, count: mappedRepos.length});
        for(const repo of mappedRepos){{
          const response=await this.repoRepository.saveRepo(repo);
          if(response.status===REPO_STATUS.INSERTED){
            results.inserted++;
          } else if(response.status===REPO_STATUS.UPDATED){
            results.updated++;
          } else if(response.status===REPO_STATUS.SKIPPED){
            results.skipped++;
          }
        }
      }
      }
      return {
        message: Response_Messages?.REPOS_SYNCED_SUCCESSFULLY,
        results,
      };
  }

  async userRepoExist(userId: string): Promise<boolean> {
    const status = await this.repoRepository.userRepoExist(userId);
    return status;;
  }
}