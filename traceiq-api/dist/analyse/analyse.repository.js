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
exports.AnalyseRepository = void 0;
const common_1 = require("@nestjs/common");
const mongodb_1 = require("mongodb");
let AnalyseRepository = class AnalyseRepository {
    constructor(db) {
        this.db = db;
        this.analysisCollection = db.collection("analysis");
        this.analysisSummaryCollection = db.collection("analysis-summary");
    }
    async findSummaryAnalysis(userId, repoId, branchName) {
        const filter = {
            gitUserId: userId,
            githubRepoId: repoId,
            branchName,
            isActiverVersion: true,
            isDeleted: false,
        };
        return this.analysisSummaryCollection.findOne(filter);
    }
    async findBranchAnalysisFiles(gitUserId, repoId, branchName) {
        const filter = {
            gitUserId,
            githubRepoId: repoId,
            branchName,
            isActiverVersion: true,
            isDeleted: false,
        };
        return this.analysisSummaryCollection.find(filter).toArray();
    }
    async saveAnalysis(data) {
        if (data.length) {
            await this.analysisCollection.insertMany(data);
        }
    }
    async saveSummaryAnalysis(data) {
        await this.analysisSummaryCollection.insertOne(data);
    }
    async archiveBranchAnalysis(gitUserId, githubRepoId, branchName) {
        await this.analysisCollection.updateMany({
            gitUserId,
            githubRepoId,
            branchName,
            isDeleted: false,
            isActiveVersion: true,
        }, {
            $set: {
                isDeleted: true,
                isActiveVersion: false,
                updatedAt: new Date(),
                updatedBy: gitUserId,
            },
        });
    }
    async archiveSummaryAnalysis(gitUserId, githubRepoId, branchName) {
        await this.analysisSummaryCollection.updateMany({
            gitUserId,
            githubRepoId,
            branchName,
            isDeleted: false,
            isActiveVersion: true,
        }, {
            $set: {
                isDeleted: true,
                isActiveVersion: false,
                updatedAt: new Date(),
                updatedBy: gitUserId,
            },
        });
    }
};
exports.AnalyseRepository = AnalyseRepository;
exports.AnalyseRepository = AnalyseRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("DATABASE_CONNECTION")),
    __metadata("design:paramtypes", [mongodb_1.Db])
], AnalyseRepository);
//# sourceMappingURL=analyse.repository.js.map