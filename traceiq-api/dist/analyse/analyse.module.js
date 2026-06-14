"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyseModule = void 0;
const common_1 = require("@nestjs/common");
const github_service_1 = require("../github/github.service");
const mongodb_module_1 = require("../mongoDB/mongodb.module");
const analyse_repository_1 = require("./analyse.repository");
const analyse_controller_1 = require("./analyse.controller");
const analyse_service_1 = require("./analyse.service");
const analysis_mapper_1 = require("./analysis.mapper");
const repo_repository_1 = require("../repo/repo.repository");
const user_service_1 = require("../user/user.service");
const user_repository_1 = require("../user/user.repository");
let AnalyseModule = class AnalyseModule {
};
exports.AnalyseModule = AnalyseModule;
exports.AnalyseModule = AnalyseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongodb_module_1.MongoDBModule,
        ],
        controllers: [analyse_controller_1.AnalyseController],
        providers: [
            analyse_service_1.AnalyseService,
            analysis_mapper_1.AnalysisMapper,
            user_service_1.UserService,
            github_service_1.GithubService,
            {
                provide: "IAnalyseRepository",
                useClass: analyse_repository_1.AnalyseRepository,
            },
            {
                provide: "IRepoRepository",
                useClass: repo_repository_1.RepoRepository,
            },
            {
                provide: "IUserRepository",
                useClass: user_repository_1.UserRepository,
            }
        ],
    })
], AnalyseModule);
//# sourceMappingURL=analyse.module.js.map