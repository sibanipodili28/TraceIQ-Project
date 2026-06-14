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
exports.GithubService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const urls_1 = require("../common/constants/urls");
let GithubService = class GithubService {
    constructor() { }
    async fetchRepos(token) {
        try {
            const url = `${process.env.GITHUB_API_BASE_URL}${urls_1.URLs.getUserRepos}`;
            const response = await axios_1.default.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        }
        catch (error) {
            throw error();
        }
    }
    async fetchBranches(owner, repo, token) {
        const url = `${process.env.GITHUB_API_BASE_URL}/repos/${owner}/${repo}/branches`;
        const res = await axios_1.default.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    }
    async fetchRepoTree(repo, branch, token) {
        const url = `${process.env.GITHUB_API_BASE_URL}/repos/${repo}/git/trees/${branch}?recursive=1`;
        const res = await axios_1.default.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const result = res.data.tree.filter((item) => item.type === "blob");
        return result;
    }
    async fetchFileContent(repo, path, token, branch) {
        try {
            const url = `${process.env.GITHUB_API_BASE_URL}/repos/${repo}/contents/${path}?ref=${branch}`;
            const res = await axios_1.default.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.data.content) {
                throw new Error("No content found");
            }
            return Buffer.from(res.data.content, "base64").toString("utf-8");
        }
        catch (error) {
            throw new Error(error?.response?.data?.message || error.message);
        }
    }
};
exports.GithubService = GithubService;
exports.GithubService = GithubService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GithubService);
//# sourceMappingURL=github.service.js.map