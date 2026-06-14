import { Injectable, Inject } from "@nestjs/common";

import { AnalyseRequestDto } from "./dtos/request/analyse.request.dto";
import { IAnalyseRepository } from "./analyse.interface";
import { GithubService } from "@/github/github.service";
import { AnalysisMapper } from "./analysis.mapper";
import { IRepoRepository } from "@/repo/interfaces/repo.interface";
import { IUserRepository } from "@/user/user-repository.interfaces";

const allowedExtensions = [
  ".ts",
  ".js",
  ".tsx",
  ".jsx",
  ".json",
  ".yml",
  ".yaml",
  ".md"
];

@Injectable()
export class AnalyseService {
  constructor(
    @Inject("IAnalyseRepository")
    private analyseRepository: IAnalyseRepository,
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
    private githubService: GithubService,   
    private analyseMapper: AnalysisMapper,
    @Inject("IRepoRepository")
    private readonly repoRepository: IRepoRepository
  ) {}

  async analyseRepo(dto: AnalyseRequestDto) {
  const { githubRepoId, branch, gitUserId } = dto;

  const userDetails = await this.userRepository.getUsers(gitUserId);

  const repo = await this.repoRepository.fetchRepo(
    gitUserId,
    githubRepoId
  );

  if (!repo) {
    throw new Error("Repository not found");
  }

  const selectedBranch = repo?.branches.find(
    (b: any) => b.name === branch
  );

  if (!selectedBranch) {
    throw new Error("Branch not found");
  }

  // If already analyzed and no new commits
  if (
    selectedBranch.lastAnalyzedSha &&
    selectedBranch.lastAnalyzedSha === selectedBranch.commitSha
  ) {
    return await this.analyseRepository.findSummaryAnalysis(
      gitUserId,
      githubRepoId,
      branch
    );
  }

  const files = await this.githubService.fetchRepoTree(
    repo.fullName,
    branch,
    userDetails[0].accessToken
  );

  // Remove previous analysis for branch
  await this.analyseRepository.archiveBranchAnalysis(
    gitUserId,
    githubRepoId,
    branch
  );

  // Analyze all files in parallel
  const results = await Promise.all(
    files
      .filter(
        (file: any) =>
          file.type === "blob" &&
        allowedExtensions.some((ext) => file.path.endsWith(ext)) &&
          !file.path.includes("node_modules") &&
          !file.path.endsWith(".png") &&
          !file.path.endsWith(".jpg") &&
          !file.path.endsWith(".jpeg") &&
          !file.path.endsWith(".gif")
      )
      .map(async (file: any) => {
        try {
          const content = await this.githubService.fetchFileContent(
            repo.fullName,
            file.path,
            userDetails[0].accessToken,
            branch
          );

          const result = this.analyzeFile(content);

          return this.analyseMapper._mapAnalysis(
            gitUserId,
            githubRepoId,
            branch,
            file.path,
            result
          );
        } catch (error: any) {
            console.log(
              `Error analyzing ${file.path}:`,
              error?.response?.data || error.message
            );
            return null;
          }
      })
  );

  const validResults = results.filter(Boolean);

  // Save file analyses
  await this.analyseRepository.saveAnalysis(validResults);

  // Generate summary
  const summary = await this.generateSummary(
    gitUserId,
    githubRepoId,
    branch
  );

  const mappedSummary = this.analyseMapper._mapSummaryAnalysis(
    gitUserId,
    githubRepoId,
    branch,
    summary
  );

  // Remove old summary
  await this.analyseRepository.archiveSummaryAnalysis(
    gitUserId,
    githubRepoId,
    branch
  );

  await this.analyseRepository.saveSummaryAnalysis(mappedSummary);

  await this.repoRepository.updateLastAnalyzedSha(
    githubRepoId,
    branch,
    selectedBranch.commitSha
  );

  return {
    message: "Analysis complete",
    totalFiles: validResults.length,
  };
}

   analyzeFile(content: string) {
  const issues = [];
  let score = 100;

  if (content.length > 8000) {
    issues.push({
      type: "maintainability",
      severity: "medium",
      message: "Large file",
    });
    score -= 10;
  }

  if (content.includes("console.log")) {
    issues.push({
      type: "best-practice",
      severity: "low",
      message: "Console log found",
    });
    score -= 5;
  }

  if (content.includes("eval(")) {
    issues.push({
      type: "security",
      severity: "high",
      message: "Use of eval()",
    });
    score -= 20;
  }

  let riskLevel = "low";

  if (score < 50) {
    riskLevel = "high";
  } else if (score < 75) {
    riskLevel = "medium";
  }

  return {
    issues,
    score,
    riskLevel,
  };
}

async generateSummary(
  gitUserId: string,
  githubRepoId: string,
  branch: string
) {
  const files = await this.analyseRepository.findBranchAnalysisFiles(
    gitUserId,
    githubRepoId,
    branch
  );

  const totalFiles = files.length;

  const avgScore =
    totalFiles > 0
      ? files.reduce((sum: number, file: any) => sum + file.score, 0) /
        totalFiles
      : 0;

  const highRiskCount = files.filter(
    (file: any) => file.riskLevel === "high"
  ).length;

  const mediumRiskCount = files.filter(
    (file: any) => file.riskLevel === "medium"
  ).length;

  const lowRiskCount = files.filter(
    (file: any) => file.riskLevel === "low"
  ).length;

  return {
    totalFiles,
    avgScore,
    riskDistribution: {
      high: highRiskCount,
      medium: mediumRiskCount,
      low: lowRiskCount,
    },
  };
}

  async getAnalysisFiles(gitUserId:string, repoId: string, branchName: string) {
    return this.analyseRepository.findBranchAnalysisFiles(gitUserId, repoId, branchName);
  }


 
}