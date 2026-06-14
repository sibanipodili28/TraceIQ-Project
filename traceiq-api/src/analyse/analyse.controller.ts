import { Controller, Post, Body, UseGuards, Req, Get, Query } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AnalyseService } from "./analyse.service";
import { AnalyseRequestDto } from "./dtos/request/analyse.request.dto";

@Controller("analysis")
export class AnalyseController {
  constructor(private readonly analyseService: AnalyseService) {}
  
  @Post("")
  @UseGuards(AuthGuard("jwt"))
  async analyseRepo(
    @Body() dto: AnalyseRequestDto,
  ) {
    return this.analyseService.analyseRepo(dto);
  }

  // GET /analysis/files?repoId=123&branch=main
@Get("files")
@UseGuards(AuthGuard("jwt"))
async getFiles(
  @Req() req:any,
  @Query("repoId") repoId: string,
  @Query("branch") branch: string
) {
  const userId = req.user?.githubId;
  if (!userId) {
    throw new Error("User ID not found in request");  
  }
  return this.analyseService.getAnalysisFiles(userId,repoId,branch);
}
}