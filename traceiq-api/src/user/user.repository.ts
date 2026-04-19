

import { Inject, Injectable } from "@nestjs/common";
import { Db, Collection } from "mongodb";
import { IUserRepository } from "./user-repository.interfaces";
import { User } from "./user.model";

@Injectable()
export class UserRepository implements IUserRepository {
  private collection: Collection<User>;

  constructor(@Inject("DATABASE_CONNECTION") private mongoDb: Db) {
    this.collection = this.mongoDb.collection<User>("users");
  }

  async isUserExists(gitUserId: string): Promise<User | null> {
    const filter = {
      gitUserId,
      isActiveVersion: true,
      isDeleted: false,
    };
    return this.collection.findOne(filter);
  }

  async getUsers(gitUserId: string): Promise<User[]> {
    const filter =gitUserId? {
      gitUserId,
      isActiveVersion: true,
      isDeleted: false,
      }:{
        isActiveVersion: true,
          isDeleted: false,
      }
    const projection = {
      gitUserId: 1,
      username: 1,
      accessToken: 1,
    }
    return this.collection.find(filter,{projection}).toArray();
}

  async saveUser(profile: any): Promise<User> {
  const existingUser = await this.isUserExists(profile.gitUserId);
  if (existingUser) {
    return existingUser;
  }
  const newUser: User = {
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
}