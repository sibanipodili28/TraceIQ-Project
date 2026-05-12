import { PlatformBaseModel } from "@/common/models/platform-model";
import { Schema } from "mongoose";

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