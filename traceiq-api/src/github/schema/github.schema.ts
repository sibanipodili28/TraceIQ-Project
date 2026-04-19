import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type RepoDocument = Repo & Document;

@Schema({ timestamps: true })
export class Repo {
  @Prop({ required: true })
  "githubRepoId": number;

  @Prop({ required: true })
  "userId": string;

  @Prop()
  "name": string;

  @Prop()
  "fullName": string;

  @Prop()
  "private": boolean;

  @Prop()
  "description": string;

  @Prop()
  "language": string;

  @Prop()
  "stars": number;

  @Prop()
  "forks": number;

  @Prop()
  "updatedAt": Date;
}

export const RepoSchema = SchemaFactory.createForClass(Repo);