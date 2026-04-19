import { User } from "./user.model";

export interface IUserRepository {
  saveUser(profile: any): Promise<User>;
  isUserExists(gitUserId: string): Promise<User | null>;
  getUsers(gitUserId?: string): Promise<User[]>;
}