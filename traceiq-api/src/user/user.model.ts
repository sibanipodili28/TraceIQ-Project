import { PlatformBaseModel } from "src/common/models/platform-model";

export interface User extends PlatformBaseModel {
  githubId: string;
  username: string;
  accessToken: string;
}