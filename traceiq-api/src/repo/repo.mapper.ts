import { generateHash } from "src/common/utils/util.functions";
import { GithubRepositoryResponseDto } from "./dtos/response/github-repository.response.dto";
import { RepoDto } from "./dtos/request/repos.request.dto";
import { last } from "rxjs";

export class RepoMapper {
    _githubReposMapper = (repos: GithubRepositoryResponseDto[], gitUserId: string):RepoDto[]=> {
      return repos.map((repo: GithubRepositoryResponseDto) => {
        const { id, full_name, ...rest } = repo; 
        const [_,ownerName]=repo.full_name.split("/");
        const mapped = {
          githubRepoId: id,
          gitUserId, 
          fullName: full_name,
          ownerName,
          ...rest,
        };
    
        return {
          ...mapped,
          hashCode: generateHash(mapped),
          version: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          isActiveVersion: true,
          isDeleted: false,
        };
      });
    };

    _repoBranchMapper=(branches:any[],defaultBranch:string)=>{
      return branches.map((branch:any)=>{
        return {
          name: branch.name,
          commitSha: branch.commit.sha,
          isDefault: branch.name === defaultBranch,
          lastAnalyzedSha: "",
        }
      });
    }

}