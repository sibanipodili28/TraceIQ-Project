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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const mongodb_1 = require("mongodb");
let UserRepository = class UserRepository {
    constructor(mongoDb) {
        this.mongoDb = mongoDb;
        this.collection = this.mongoDb.collection("users");
    }
    async isUserExists(gitUserId) {
        const filter = {
            gitUserId,
            isActiveVersion: true,
            isDeleted: false,
        };
        return this.collection.findOne(filter);
    }
    async getUsers(gitUserId) {
        const filter = gitUserId ? {
            gitUserId,
            isActiveVersion: true,
            isDeleted: false,
        } : {
            isActiveVersion: true,
            isDeleted: false,
        };
        const projection = {
            gitUserId: 1,
            username: 1,
            accessToken: 1,
        };
        return this.collection.find(filter, { projection }).toArray();
    }
    async saveUser(profile) {
        const existingUser = await this.isUserExists(profile.gitUserId);
        if (existingUser) {
            return existingUser;
        }
        const newUser = {
            gitUserId: profile.gitUserId,
            username: profile.username,
            accessToken: profile.accessToken,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: profile.username,
            updatedBy: profile.username,
            isActiveVersion: true,
            version: 1,
            isDeleted: false,
        };
        const result = await this.collection.insertOne(newUser);
        return {
            ...newUser,
            _id: result.insertedId,
        };
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("DATABASE_CONNECTION")),
    __metadata("design:paramtypes", [mongodb_1.Db])
], UserRepository);
//# sourceMappingURL=user.repository.js.map