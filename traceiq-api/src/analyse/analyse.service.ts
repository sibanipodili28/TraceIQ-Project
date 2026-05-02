// import { GithubService } from "@/github/github.service";
// import { Inject, Injectable } from "@nestjs/common";
// import { IAnalyseRepository } from "./analyse.interface";

// @Injectable()
// export class AnalyseService {
//     constructor(
//         @Inject("IAnalyseRepository")
//         private analyseRepository: IAnalyseRepository,
//         private githubService: GithubService,
//       ) {}

//       async analyzeRepo(repo, user) {
//     const [owner, repoName] = repo.fullName.split("/");

//     const files = await this.getRepoFiles(
//         owner,
//         repoName,
//         user.accessToken
//     );

//     for (const file of files) {
//         if (file.type !== "file") continue;

//         const fileContent = await axios.get(file.download_url);

//         const result = this.analyzeFile(fileContent.data);

//         await this.analysisModel.create({
//         userId: user.githubId,
//         repoId: repo.githubRepoId,
//         fileName: file.name,
//         ...result,
//         });
//     }

//     return { message: "Analysis complete" };
//     }

// }

// analyse.service.ts

import { Injectable, Inject } from "@nestjs/common";
import axios from "axios";

import { AnalyseRequestDto } from "./dtos/request/analyse.request.dto";
import { IAnalyseRepository } from "./analyse.interface";
import { UserRepository } from "@/user/user.repository";
import { GithubService } from "@/github/github.service";
import { AnalysisMapper } from "./repo.mapper";
import { RepoRepository } from "@/repo/repo.repository";

interface JwtUser {
  accessToken: string;
}

@Injectable()
export class AnalyseService {
  constructor(
    @Inject("IAnalyseRepository")
    private analyseRepository: IAnalyseRepository,
    private userRepository: UserRepository,
    private githubService: GithubService,   
    private analyseMapper: AnalysisMapper,
    private repoRepository: RepoRepository
  ) {}

  async analyseRepo(dto: AnalyseRequestDto) {
    const { githubRepoId, branch,gitUserId } = dto;
    const userDetails = await this.userRepository.getUsers(gitUserId);
    const repo = await this.repoRepository.fetchRepo(gitUserId,githubRepoId);
    const selectedBranch = repo?.branches.find((b:any) => b.name === branch);
     if (!selectedBranch) {
      throw new Error("Branch not found");
    }
    if(selectedBranch.lastAnalyzedSha === selectedBranch.commitSha){
        return await this.analyseRepository?.findSummaryAnalysis(gitUserId,githubRepoId, branch);
    }
    const files = await this.githubService.fetchRepoTree(
      repo?.ownerName || "",
      repo?.name || "",
      branch,
      userDetails[0]?.accessToken
    );

    const results = [];

    for (const file of files) {
      if (
        file.path.includes("node_modules") ||
        file.path.endsWith(".png") ||
        file.path.endsWith(".jpg")
      ) continue;

      try {
        const content = await this.githubService?.fetchFileContent(
          repo?.ownerName || "",
          repo?.name || "",
          file.path,
          userDetails[0].accessToken
        );
        const result = this.analyzeFile(content);
        const mapperResult=this.analyseMapper._mapAnalysis(gitUserId, githubRepoId, branch, file.path, result); 
        results.push(mapperResult); 
        await this.analyseRepository.saveAnalysis(mapperResult);
      } catch (err) {
        console.log("Error analyzing:", file.path);
      }
    }

     const summary=await this.generateSummary(gitUserId, githubRepoId, branch);
     await this.analyseRepository.saveSummaryAnalysis(this.analyseMapper._mapSummaryAnalysis(gitUserId, githubRepoId, branch, summary));
     await this.repoRepository.updateLastAnalyzedSha(githubRepoId, branch, selectedBranch.commitSha);
     return { message: "Analysis complete" };
 
  }

   analyzeFile(content: string) {
    const issues = [];
    let score = 100;

    if (content.length > 8000) {
      issues.push({ type: "maintainability", severity: "medium", message: "Large file" });
      score -= 10;
    }

    if (content.includes("console.log")) {
      issues.push({ type: "best-practice", severity: "low", message: "Console log found" });
      score -= 5;
    }

    if (content.includes("eval(")) {
      issues.push({ type: "security", severity: "high", message: "Use of eval()" });
      score -= 20;
    }

    let riskLevel = "low";
    if (score < 50) riskLevel = "high";
    else if (score < 75) riskLevel = "medium";

    return { issues, score, riskLevel };
  }

    async generateSummary(user: any, repo: any, branch: string) {
    const files = await this.analyseRepository.findBranchAnalysisFiles( user, repo, branch);

    const totalFiles = files.length;

    const avgScore =
      files.reduce((sum:any, f:any) => sum + f.score, 0) / (totalFiles || 1);

    const highRiskCount = files.filter((f:any) => f.riskLevel === "high").length;
    const mediumRiskCount = files.filter((f:any) => f.riskLevel === "medium").length;
    const lowRiskCount = files.filter((f:any) => f.riskLevel === "low").length;
    return{
      totalFiles,
      avgScore,
      riskDistribution: { high: highRiskCount, medium: mediumRiskCount, low: lowRiskCount }
    }
  }


 
}