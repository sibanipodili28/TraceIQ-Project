import { generateHash } from "src/common/utils/util.functions";
import { GithubRepositoryResponseDto } from "./dtos/response/github-repository.response.dto";
import { RepoDto } from "./dtos/request/repos.request.dto";

export class RepoMapper {
    _githubReposMapper = (repos: GithubRepositoryResponseDto[], gitUserId: string):RepoDto[]=> {
      return repos.map((repo: GithubRepositoryResponseDto) => {
        const mapped = {
          githubRepoId: repo.id,
          gitUserId, 
          name: repo.name,
          fullName: repo.full_name,
          private: repo.private,
          description: repo.description,
          language: repo.language,  
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          updatedAt: new Date(repo.updated_at),
        };
    
        return {
          ...mapped,
          hashCode: generateHash(mapped),
          version: 1,
          createdAt: new Date(),
          updatedAtRecord: new Date(),
          isActiveVersion: true,
          isDeleted: false,
        };
      });
    };

}