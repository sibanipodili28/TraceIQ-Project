export interface IAnalyseRepository {
  findSummaryAnalysis(repoId: string, branchName: string): Promise<any>;
  saveAnalysis(data: any[]): Promise<void>;
  findBranchAnalysisFiles(gitUserId:string,repoId: string,branchName: string): Promise<any[]>;
  findSummaryAnalysis(gitUserId:string,repoId: string,branchName: string): Promise<any>;
  saveSummaryAnalysis(data: any): Promise<void>;
}