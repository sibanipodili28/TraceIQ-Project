// import { Inject, Injectable } from "@nestjs/common";
// import type { IUserRepository } from "./user-repository.interfaces";
// import { INTERFACES } from "./constants/interface.constants";

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

import { Inject, Injectable } from "@nestjs/common";
import axios from "axios";
import { IUserRepository } from "./user-repository.interfaces";
import { INTERFACES } from "./constants/interface.constants";
import { User } from "./user.model";

@Injectable()
export class UserService {
  constructor(
    @Inject(INTERFACES.IUserRepository)
    private userRepository: IUserRepository
  ) {}

  // ✅ Save user
  async saveUser(profile: any) {
    return this.userRepository.saveUser(profile);
  }
  async getUsers(gitUserId:string): Promise<User[]> {
    const users = await this.userRepository.getUsers(gitUserId); // ✅ store in variable
    return users;  
  }
}
