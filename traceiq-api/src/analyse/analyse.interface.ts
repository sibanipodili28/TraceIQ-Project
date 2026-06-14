export interface IAnalyseRepository {
  saveAnalysis(data: any[]): Promise<void>;
  findBranchAnalysisFiles(gitUserId:string,repoId: string,branchName: string): Promise<any[]>;
  findSummaryAnalysis(gitUserId:string,repoId: string,branchName: string): Promise<any>;
  saveSummaryAnalysis(data: any): Promise<void>;
  findBranchAnalysisFiles(gitUserId:string,repoId: string,branchName: string): Promise<any[]>;
  archiveBranchAnalysis(gitUserId:string,repoId: string,branchName: string): Promise<void>;
  archiveSummaryAnalysis(gitUserId:string,repoId: string,branchName: string): Promise<void>;
}