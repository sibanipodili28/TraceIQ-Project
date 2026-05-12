import { Controller, Post, Body, UseGuards, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { AnalyseService } from "./analyse.service";
import { AnalyseRequestDto } from "./dtos/request/analyse.request.dto";

@Controller("analyse")
export class AnalyseController {
  constructor(private readonly analyseService: AnalyseService) {}

  @Post("/")
  @UseGuards(AuthGuard("jwt"))
  async analyseRepo(
    @Body() dto: AnalyseRequestDto,
  ) {
    return this.analyseService.analyseRepo(dto);
  }
}