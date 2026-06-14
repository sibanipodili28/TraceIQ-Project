"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepoModule = void 0;
const common_1 = require("@nestjs/common");
const repo_controller_1 = require("./repo.controller");
const repo_service_1 = require("./repo.service");
const repo_repository_1 = require("./repo.repository");
const github_service_1 = require("../github/github.service");
const repo_mapper_1 = require("./repo.mapper");
const user_service_1 = require("../user/user.service");
const user_repository_1 = require("../user/user.repository");
const mongodb_module_1 = require("../mongoDB/mongodb.module");
let RepoModule = class RepoModule {
};
exports.RepoModule = RepoModule;
exports.RepoModule = RepoModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongodb_module_1.MongoDBModule,
        ],
        controllers: [repo_controller_1.RepoController],
        providers: [
            user_service_1.UserService,
            repo_service_1.RepoService,
            github_service_1.GithubService,
            repo_mapper_1.RepoMapper,
            {
                provide: "IRepoRepository",
                useClass: repo_repository_1.RepoRepository,
            },
            {
                provide: "IUserRepository",
                useClass: user_repository_1.UserRepository,
            },
        ],
    })
], RepoModule);
//# sourceMappingURL=repo.module.js.map