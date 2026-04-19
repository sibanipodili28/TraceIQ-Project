import { GithubRepositoryResponseDto } from "@/repo/dtos/response/github-repository.response.dto";
import { Injectable } from "@nestjs/common";
import axios from "axios";
import { URLs } from "src/common/constants/urls";

@Injectable()
export class GithubService {
  constructor() {}

  async fetchRepos(token:string):Promise<GithubRepositoryResponseDto[]>{
    try
    {
      const url=`${process.env.GITHUB_API_BASE_URL}${URLs.getUserRepos}`;
       const response = await axios.get(
          url,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
    } catch (error: any) {
        throw error();
    }
  }
}