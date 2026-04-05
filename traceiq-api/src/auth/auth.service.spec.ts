import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
  ) {}

  async validateUser(profile: any) {
  }

  async generateJwt(user: any) {
    return this.jwtService.sign({
      githubId: user.githubId,
      username: user.username,
    });
  }
}