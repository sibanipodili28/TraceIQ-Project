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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
const repo_service_1 = require("../repo/repo.service");
let AuthService = class AuthService {
    constructor(jwtService, userService, reposervice) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.reposervice = reposervice;
    }
    async processUserProfile(profile) {
        const user = await this.userService.saveUser(profile);
        const repoExists = await this.reposervice.userRepoExist(user.gitUserId);
        if (!repoExists) {
            this.reposervice.syncRepos(user.gitUserId);
        }
        const token = this._generateJwt(user);
        return token;
    }
    _generateJwt(user) {
        return this.jwtService.sign({
            gitUserId: user.gitUserId,
            username: user.username,
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_service_1.UserService,
        repo_service_1.RepoService])
], AuthService);
//# sourceMappingURL=auth.service.js.map