import { Repo } from "../repo.model";

export interface IRepoRepository {
  getRepos(userId: string): Promise<any[]>;
  fetchRepo(userId: string,repoId:string): Promise<any> 
  cloneRepo(cloneUrl: string): Promise<any>;
  saveRepo(repo: Repo): Promise<any>;
  userRepoExist(userId: string): Promise<boolean>;
  updateLastAnalyzedSha(repoId: string, branchName: string, sha: string): Promise<any>;
}