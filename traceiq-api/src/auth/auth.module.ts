// auth.module.ts
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
// import { GithubStrategy } from "./github.strategy";
// import { JwtStrategy } from "./jwt.strategy";
// import { UserService } from "../user/user.service";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1d" },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // GithubStrategy,
    // JwtStrategy,
    // UserService,
  ],
})
export class AuthModule {}