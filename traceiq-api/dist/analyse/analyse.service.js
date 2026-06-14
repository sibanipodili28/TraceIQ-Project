"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyseService = void 0;
const common_1 = require("@nestjs/common");
const github_service_1 = require("../github/github.service");
const analysis_mapper_1 = require("./analysis.mapper");
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
let AnalyseService = class AnalyseService {
    constructor(analyseRepository, userRepository, githubService, analyseMapper, repoRepository) {
        this.analyseRepository = analyseRepository;
        this.userRepository = userRepository;
        this.githubService = githubService;
        this.analyseMapper = analyseMapper;
        this.repoRepository = repoRepository;
    }
    async analyseRepo(dto) {
        const { githubRepoId, branch, gitUserId } = dto;
        const userDetails = await this.userRepository.getUsers(gitUserId);
        const repo = await this.repoRepository.fetchRepo(gitUserId, githubRepoId);
        if (!repo) {
            throw new Error("Repository not found");
        }
        const selectedBranch = repo?.branches.find((b) => b.name === branch);
        if (!selectedBranch) {
            throw new Error("Branch not found");
        }
        // If already analyzed and no new commits
        if (selectedBranch.lastAnalyzedSha &&
            selectedBranch.lastAnalyzedSha === selectedBranch.commitSha) {
            return await this.analyseRepository.findSummaryAnalysis(gitUserId, githubRepoId, branch);
        }
        const files = await this.githubService.fetchRepoTree(repo.fullName, branch, userDetails[0].accessToken);
        // Remove previous analysis for branch
        await this.analyseRepository.archiveBranchAnalysis(gitUserId, githubRepoId, branch);
        // Analyze all files in parallel
        const results = await Promise.all(files
            .filter((file) => file.type === "blob" &&
            allowedExtensions.some((ext) => file.path.endsWith(ext)) &&
            !file.path.includes("node_modules") &&
            !file.path.endsWith(".png") &&
            !file.path.endsWith(".jpg") &&
            !file.path.endsWith(".jpeg") &&
            !file.path.endsWith(".gif"))
            .map(async (file) => {
            try {
                const content = await this.githubService.fetchFileContent(repo.fullName, file.path, userDetails[0].accessToken, branch);
                const result = this.analyzeFile(content);
                return this.analyseMapper._mapAnalysis(gitUserId, githubRepoId, branch, file.path, result);
            }
            catch (error) {
                console.log(`Error analyzing ${file.path}:`, error?.response?.data || error.message);
                return null;
            }
        }));
        const validResults = results.filter(Boolean);
        // Save file analyses
        await this.analyseRepository.saveAnalysis(validResults);
        // Generate summary
        const summary = await this.generateSummary(gitUserId, githubRepoId, branch);
        const mappedSummary = this.analyseMapper._mapSummaryAnalysis(gitUserId, githubRepoId, branch, summary);
        // Remove old summary
        await this.analyseRepository.archiveSummaryAnalysis(gitUserId, githubRepoId, branch);
        // Save new summary
        await this.analyseRepository.saveSummaryAnalysis(mappedSummary);
        // Update branch last analyzed SHA
        await this.repoRepository.updateLastAnalyzedSha(githubRepoId, branch, selectedBranch.commitSha);
        return {
            message: "Analysis complete",
            totalFiles: validResults.length,
        };
    }
    analyzeFile(content) {
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
        }
        else if (score < 75) {
            riskLevel = "medium";
        }
        return {
            issues,
            score,
            riskLevel,
        };
    }
    async generateSummary(gitUserId, githubRepoId, branch) {
        const files = await this.analyseRepository.findBranchAnalysisFiles(gitUserId, githubRepoId, branch);
        const totalFiles = files.length;
        const avgScore = totalFiles > 0
            ? files.reduce((sum, file) => sum + file.score, 0) /
                totalFiles
            : 0;
        const highRiskCount = files.filter((file) => file.riskLevel === "high").length;
        const mediumRiskCount = files.filter((file) => file.riskLevel === "medium").length;
        const lowRiskCount = files.filter((file) => file.riskLevel === "low").length;
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
    async getAnalysisFiles(gitUserId, repoId, branchName) {
        return this.analyseRepository.findBranchAnalysisFiles(gitUserId, repoId, branchName);
    }
};
exports.AnalyseService = AnalyseService;
exports.AnalyseService = AnalyseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("IAnalyseRepository")),
    __param(1, (0, common_1.Inject)("IUserRepository")),
    __param(4, (0, common_1.Inject)("IRepoRepository")),
    __metadata("design:paramtypes", [Object, Object, github_service_1.GithubService,
        analysis_mapper_1.AnalysisMapper, Object])
], AnalyseService);
//# sourceMappingURL=analyse.service.js.map