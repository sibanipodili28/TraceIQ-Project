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
exports.RepoRepository = void 0;
const common_1 = require("@nestjs/common");
const simple_git_1 = require("simple-git");
const mongodb_1 = require("mongodb");
const status_1 = require("./constants/status");
let RepoRepository = class RepoRepository {
    constructor(db) {
        this.db = db;
        this.git = (0, simple_git_1.default)();
        this._mergeBranches = (existingBranches = [], newBranches) => {
            const existingMap = new Map(existingBranches.map((b) => [b.name.toLowerCase(), b]));
            let hasChanges = false;
            const mergedBranches = newBranches.map((branch) => {
                const name = branch.name;
                const newCommitSha = branch.commit.sha;
                const existing = existingMap.get(name.toLowerCase());
                if (!existing) {
                    hasChanges = true;
                    return {
                        name,
                        commitSha: newCommitSha,
                        isDefault: branch.isDefault,
                        lastAnalyzedSha: "",
                    };
                }
                if (existing.commitSha !== newCommitSha) {
                    hasChanges = true;
                    return {
                        ...existing,
                        commitSha: newCommitSha,
                        isDefault: branch.isDefault,
                    };
                }
                return existing;
            });
            if (existingBranches.length !== mergedBranches.length) {
                hasChanges = true;
            }
            return {
                branches: mergedBranches,
                hasChanges,
            };
        };
        this.collection = this.db.collection("repositories");
    }
    async getRepos(userId) {
        console.log("Fetching repos for user:", userId);
        const filter = {
            gitUserId: userId,
            isActiveVersion: true,
            isDeleted: false,
        };
        const projection = {
            githubRepoId: 1,
            gitUserId: 1,
            fullName: 1,
            branches: 1
        };
        const result = await this.collection.find(filter, { projection }).toArray();
        return result;
    }
    async fetchRepo(userId, repoId) {
        console.log("Fetching repos for user:", userId);
        const filter = {
            gitUserId: userId,
            githubRepoId: repoId,
            isActiveVersion: true,
            isDeleted: false,
        };
        const projection = {
            githubRepoId: 1,
            gitUserId: 1,
            fullName: 1,
            branches: 1,
            "owner.login": 1,
            "owner.id": 1,
            "owner.node_id": 1,
        };
        const result = await this.collection.findOne(filter, { projection });
        return result;
    }
    async cloneRepo(cloneUrl) {
        try {
            const repoName = cloneUrl.split("/").pop()?.replace(".git", "");
            await this.git.clone(cloneUrl, `repos/${repoName}`);
            return {
                message: "Repository cloned successfully",
                repoName,
            };
        }
        catch (error) {
            console.error("Clone error:", error);
            throw new Error("Failed to clone repository");
        }
    }
    async saveRepo(repo) {
        const filter = {
            githubRepoId: repo.githubRepoId,
            gitUserId: repo.gitUserId,
            isDeleted: false,
            isActiveVersion: true,
        };
        let branchesUpdate = false;
        const existing = await this.collection.findOne(filter);
        if (existing) {
            const { branches, hasChanges } = this._mergeBranches(existing.branches || [], repo.branches || []);
            repo.branches = branches;
            branchesUpdate = hasChanges;
        }
        if (!existing) {
            await this.collection.insertOne({
                ...repo,
                version: 1,
                isActiveVersion: true,
                isDeleted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            return {
                status: status_1.REPO_STATUS.INSERTED,
            };
        }
        else if (existing.hashCode === repo.hashCode && !branchesUpdate) {
            return {
                status: status_1.REPO_STATUS.SKIPPED,
            };
        }
        else {
            await this.collection.updateOne(filter, {
                $set: {
                    isActiveVersion: false,
                    updatedAt: new Date(),
                },
            });
            await this.collection.insertOne({
                ...repo,
                version: (existing.version || 1) + 1,
                isActiveVersion: true,
                isDeleted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            return {
                status: status_1.REPO_STATUS.UPDATED,
            };
        }
    }
    async userRepoExist(userId) {
        const filter = {
            gitUserId: userId,
            isDeleted: false,
            isActiveVersion: true,
        };
        const count = await this.collection.countDocuments(filter);
        return count > 0;
    }
    async updateLastAnalyzedSha(repoId, branchName, sha) {
        await this.collection.updateOne({
            githubRepoId: repoId,
            "branches.name": branchName,
        }, {
            $set: {
                "branches.$.lastAnalyzedSha": sha,
            },
        });
    }
};
exports.RepoRepository = RepoRepository;
exports.RepoRepository = RepoRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("DATABASE_CONNECTION")),
    __metadata("design:paramtypes", [mongodb_1.Db])
], RepoRepository);
//# sourceMappingURL=repo.repository.js.map