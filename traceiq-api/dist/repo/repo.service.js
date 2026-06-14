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
exports.RepoService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const custom_exceptions_1 = require("../common/exceptions/custom-exceptions");
const messages_1 = require("../common/constants/messages");
const github_service_1 = require("../github/github.service");
const repo_mapper_1 = require("./repo.mapper");
const status_1 = require("./constants/status");
const message_1 = require("./constants/message");
let RepoService = class RepoService {
    constructor(repoRepository, userService, githubService, repoMapper) {
        this.repoRepository = repoRepository;
        this.userService = userService;
        this.githubService = githubService;
        this.repoMapper = repoMapper;
    }
    async getRepos(userId) {
        return this.repoRepository.getRepos(userId);
    }
    async cloneGithubRepo(cloneUrl) {
        return this.repoRepository.cloneRepo(cloneUrl);
    }
    async syncRepos(gitUserId) {
        const users = await this.userService.getUsers(gitUserId);
        if (!users.length) {
            throw new custom_exceptions_1.CustomException(messages_1.Exception_Messages?.USER_NOT_FOUND, common_1.HttpStatus.NOT_FOUND);
        }
        let results = {
            totalRepos: [],
            inserted: 0,
            updated: 0,
            skipped: 0,
        };
        for (const user of users) {
            const userRepos = await this.githubService.fetchRepos(user.accessToken);
            const mappedRepos = this.repoMapper._githubReposMapper(userRepos, user.gitUserId);
            results.totalRepos?.push({ userId: user.gitUserId, count: mappedRepos.length });
            for (const repo of mappedRepos) {
                {
                    const branchDetails = await this.githubService.fetchBranches(repo.fullName.split("/")[0], repo.name, user.accessToken);
                    repo.branches = this.repoMapper._repoBranchMapper(branchDetails, repo.default_branch);
                    const response = await this.repoRepository.saveRepo(repo);
                    if (response.status === status_1.REPO_STATUS.INSERTED) {
                        results.inserted++;
                    }
                    else if (response.status === status_1.REPO_STATUS.UPDATED) {
                        results.updated++;
                    }
                    else if (response.status === status_1.REPO_STATUS.SKIPPED) {
                        results.skipped++;
                    }
                }
            }
        }
        return {
            message: message_1.Response_Messages?.REPOS_SYNCED_SUCCESSFULLY,
            results,
        };
    }
    async userRepoExist(userId) {
        const status = await this.repoRepository.userRepoExist(userId);
        return status;
        ;
    }
};
exports.RepoService = RepoService;
exports.RepoService = RepoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("IRepoRepository")),
    __metadata("design:paramtypes", [Object, user_service_1.UserService,
        github_service_1.GithubService,
        repo_mapper_1.RepoMapper])
], RepoService);
//# sourceMappingURL=repo.service.js.map