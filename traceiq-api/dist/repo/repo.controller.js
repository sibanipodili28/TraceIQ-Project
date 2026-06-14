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
exports.RepoController = void 0;
const common_1 = require("@nestjs/common");
const repo_service_1 = require("./repo.service");
const passport_1 = require("@nestjs/passport");
let RepoController = class RepoController {
    constructor(repoService) {
        this.repoService = repoService;
    }
    async getRepos(req) {
        console.log("Get repos request received with user:", req);
        const userId = req.user?.gitUserId;
        if (!userId) {
            throw new Error("User ID not found in request");
        }
        return this.repoService.getRepos(userId);
    }
    async cloneRepo(cloneUrl) {
        return this.repoService.cloneGithubRepo(cloneUrl);
    }
    async syncRepos(gitUserId) {
        return this.repoService.syncRepos(gitUserId);
    }
};
exports.RepoController = RepoController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RepoController.prototype, "getRepos", null);
__decorate([
    (0, common_1.Post)("clone"),
    __param(0, (0, common_1.Body)("clone_url")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RepoController.prototype, "cloneRepo", null);
__decorate([
    (0, common_1.Get)("sync"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __param(0, (0, common_1.Query)("gitUserId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RepoController.prototype, "syncRepos", null);
exports.RepoController = RepoController = __decorate([
    (0, common_1.Controller)("repo"),
    __metadata("design:paramtypes", [repo_service_1.RepoService])
], RepoController);
//# sourceMappingURL=repo.controller.js.map