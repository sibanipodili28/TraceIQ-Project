import { Controller, Get, Post, Headers, Body, Query, Req, UseGuards } from "@nestjs/common";
import { RepoService } from "./repo.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("repo")
export class RepoController {
  constructor(private readonly repoService: RepoService) {}

  @Get()
  @UseGuards(AuthGuard("jwt"))
  async getRepos(@Req() req:any) {
    console.log("Get repos request received with user:", req);
    const userId=req.user?.gitUserId;
    if(!userId){
      throw new Error("User ID not found in request");
    }
    return this.repoService.getRepos(userId);
  }

  @Post("clone")
  async cloneRepo(@Body("clone_url") cloneUrl: string) {
    return this.repoService.cloneGithubRepo(cloneUrl);
  }

   @Get("sync")
   @UseGuards(AuthGuard("jwt"))
    async syncRepos(
      @Query("gitUserId") gitUserId: string
    ) {
      return this.repoService.syncRepos(gitUserId);
    }
}