"use strict";
// import { Inject, Injectable } from "@nestjs/common";
// import type { IUserRepository } from "./user-repository.interfaces";
// import { INTERFACES } from "./constants/interface.constants";
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
exports.UserService = void 0;
// @Injectable()
// export class UserService {
//   constructor(
//     @Inject(INTERFACES.IUserRepository)
//     private userRepository: IUserRepository
//   ) {}
//   async saveUser(profile: any) {
//     return this.userRepository.saveUser(profile);
//   }
// }
const common_1 = require("@nestjs/common");
const interface_constants_1 = require("./constants/interface.constants");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    // ✅ Save user
    async saveUser(profile) {
        return this.userRepository.saveUser(profile);
    }
    async getUsers(gitUserId) {
        const users = await this.userRepository.getUsers(gitUserId); // ✅ store in variable
        return users;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(interface_constants_1.INTERFACES.IUserRepository)),
    __metadata("design:paramtypes", [Object])
], UserService);
//# sourceMappingURL=user.service.js.map