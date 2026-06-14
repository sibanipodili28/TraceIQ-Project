import { PlatformBaseModel } from "@/common/models/platform-model";

export interface Analysis extends PlatformBaseModel
{
    githubRepoId: String,
    gitUserId: String,
    branchName: String,
    repoName: String,
    filePath: String,
    score: Number,
    riskLevel: String,
    issues: [
      {
        type: String,
        severity: String,
        message: String,
      },
    ],
}