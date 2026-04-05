import { User } from "./user.model";

export interface IUserRepository {
  findOrCreate(profile: any): Promise<User>;
  isUserExists(githubId: string): Promise<User | null>;
}