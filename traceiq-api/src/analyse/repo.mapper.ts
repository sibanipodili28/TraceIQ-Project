

export class AnalysisMapper {

  _mapAnalysis(gitUserId: string, githubRepoId: string, branchName: string, filePath: string, result: any) {
    return{
      gitUserId,
      githubRepoId,
      branchName,
      filePath,
      ...result,
      isActiverVersion: true,
      isDeleted: false,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(), 
      createdBy: gitUserId,
      updatedBy: gitUserId, 
    }
  }

  _mapSummaryAnalysis(gitUserId: string, githubRepoId: string, branchName: string, summaryResult: any) {
    return{
      gitUserId,
      githubRepoId,
      branchName,
      ...summaryResult,
      isActiverVersion: true,
      isDeleted: false,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: gitUserId,
      updatedBy: gitUserId, 
    }
  }
}