import { PlatformBaseModel } from "src/common/models/platform-model";

export interface User extends PlatformBaseModel {
  gitUserId: string;
  username: string;
  accessToken: string;
}