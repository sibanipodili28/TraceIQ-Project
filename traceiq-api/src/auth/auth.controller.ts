import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("github")
  @UseGuards(AuthGuard("github"))
  async githubAuth() {
    console.log("GitHub auth route hit");
  }

  @Get("github/callback")
  @UseGuards(AuthGuard("github"))
  async githubCallback(@Req() req:any, @Res() res:any) {
    const token = await this.authService.processUserProfile(req.user);
    res.redirect(
      `${process.env.FRONTEND_URL}/dashboard?token=${token}`
    );
  }
}