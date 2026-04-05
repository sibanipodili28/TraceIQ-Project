import { Inject, Injectable } from "@nestjs/common";
import { Db, Collection } from "mongodb";
import { IUserRepository } from "./user-repository.interfaces";
import { User } from "./user.model";

@Injectable()
export class UserRepository implements IUserRepository {
  private collection: Collection<User>;

  constructor(
    @Inject('DATABASE_CONNECTION') private mongoDb: Db
  ) {
    this.collection = this.mongoDb.collection<User>('users');
  }

  async isUserExists(githubId: string): Promise<User | null> {
    return this.collection.findOne({ githubId });
  }

  async findOrCreate(profile: any): Promise<User> {
  const existingUser = await this.isUserExists(profile.githubId);

  if (!existingUser) {
    const newUser: User = {
      githubId: profile.githubId,
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

    console.log("result:",result);
    return {
      ...newUser,
      _id: result.insertedId,
    };
  } else {
    const updatedVersion = (existingUser.version || 1) + 1;

    await this.collection.updateOne(
      { githubId: profile.githubId },
      {
        $set: {
          accessToken: profile.accessToken,

          updatedAt: new Date(),
          updatedBy: profile.username,
          version: updatedVersion,
        },
      }
    );

    return {
      ...existingUser,
      accessToken: profile.accessToken,
      updatedAt: new Date(),
      updatedBy: profile.username,
      version: updatedVersion,
    };
  }
}
}