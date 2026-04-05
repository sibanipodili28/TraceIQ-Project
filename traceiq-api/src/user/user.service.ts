import { Inject, Injectable } from "@nestjs/common";
import type { IUserRepository } from "./user-repository.interfaces";
import { INTERFACES } from "./constants/interface.constants";

@Injectable()
export class UserService {
  constructor(
    @Inject(INTERFACES.IUserRepository)
    private userRepository: IUserRepository
  ) {}

  async findOrCreate(profile: any) {
    return this.userRepository.findOrCreate(profile);
  }
}