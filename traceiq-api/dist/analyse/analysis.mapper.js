"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisMapper = void 0;
class AnalysisMapper {
    _mapAnalysis(gitUserId, githubRepoId, branchName, filePath, result) {
        return {
            gitUserId,
            githubRepoId,
            branchName,
            filePath,
            ...result,
            isActiveVersion: true,
            isDeleted: false,
            version: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: gitUserId,
            updatedBy: gitUserId,
        };
    }
    _mapSummaryAnalysis(gitUserId, githubRepoId, branchName, summaryResult) {
        return {
            gitUserId,
            githubRepoId,
            branchName,
            ...summaryResult,
            isActiveVersion: true,
            isDeleted: false,
            version: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: gitUserId,
            updatedBy: gitUserId,
        };
    }
}
exports.AnalysisMapper = AnalysisMapper;
//# sourceMappingURL=analysis.mapper.js.map