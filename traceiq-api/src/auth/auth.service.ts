import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { User } from "src/user/user.model";
import { GithubService } from "src/github/github.service";
import { RepoService } from "@/repo/repo.service";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private reposervice: RepoService
  ) {}

  async processUserProfile(profile: any): Promise<string> {
    const user = await this.userService.saveUser(profile);
    const repoExists=await this.reposervice.userRepoExist(user.gitUserId);
    if(!repoExists){
      this.reposervice.syncRepos(user.gitUserId);
    }
    const token = this._generateJwt(user);
    return token;  
  }
  

  _generateJwt(user: any) {
    return this.jwtService.sign({
      gitUserId: user.gitUserId,
      username: user.username,
    });
  }
}