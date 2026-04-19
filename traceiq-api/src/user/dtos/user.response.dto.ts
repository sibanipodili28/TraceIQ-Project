export class UserResponseDto {
  _id?: any;

  gitUserId?: string;
  username?: string;
  accessToken?: string;

  version?: number;

  isActiveVersion?: boolean;
  isDeleted?: boolean;

  createdAt?: Date;
  updatedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
}