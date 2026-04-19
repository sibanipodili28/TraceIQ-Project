import { PlatformBaseModel } from "@/common/models/platform-model";

export interface Repo extends PlatformBaseModel {
  githubRepoId: number;
  gitUserId: string;
  name: string;
  fullName: string;
  private: boolean;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  hashCode: string;
  updatedAtRecord: Date | string;
}