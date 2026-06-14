"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepoMapper = void 0;
const util_functions_1 = require("../common/utils/util.functions");
class RepoMapper {
    constructor() {
        this._githubReposMapper = (repos, gitUserId) => {
            return repos.map((repo) => {
                const { id, full_name, ...rest } = repo;
                const [_, ownerName] = repo.full_name.split("/");
                const mapped = {
                    githubRepoId: id,
                    gitUserId,
                    fullName: full_name,
                    ownerName,
                    ...rest,
                };
                return {
                    ...mapped,
                    hashCode: (0, util_functions_1.generateHash)(mapped),
                    version: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isActiveVersion: true,
                    isDeleted: false,
                };
            });
        };
        this._repoBranchMapper = (branches, defaultBranch) => {
            return branches.map((branch) => {
                return {
                    name: branch.name,
                    commitSha: branch.commit.sha,
                    isDefault: branch.name === defaultBranch,
                    lastAnalyzedSha: "",
                };
            });
        };
    }
}
exports.RepoMapper = RepoMapper;
//# sourceMappingURL=repo.mapper.js.map