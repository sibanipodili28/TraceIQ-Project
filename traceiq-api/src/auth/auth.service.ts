import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { User } from "src/user/user.model";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  async validateUser(profile: any): Promise<User> {
    const user = await this.userService.findOrCreate(profile);
    return user;  
  }

  async generateJwt(user: any) {
    return this.jwtService.sign({
      githubId: user.githubId,
      username: user.username,
    });
  }
}