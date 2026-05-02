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

  async fetchBranches(owner: string, repo: string, token: string) {
  const url = `${process.env.GITHUB_API_BASE_URL}/repos/${owner}/${repo}/branches`;
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
  }

  async fetchRepoTree(owner: string, repo: string, token: string,branch:string) {
  const url = `${process.env.GITHUB_API_BASE_URL}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result=res.data.tree.filter((item:any) => item.type === "blob");
  return result;
  }

  async fetchFileContent(owner: string, repo: string, token: string,path:string) {
  const url = `${process.env.GITHUB_API_BASE_URL}/repos/${owner}/${repo}/content/${path}`;
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result=Buffer.from(res.data.content, "base64").toString("utf-8");
  return result;
  }


}