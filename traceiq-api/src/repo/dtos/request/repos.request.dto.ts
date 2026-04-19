export class RepoDto {
  githubRepoId!: number;
  gitUserId!: string;

  name!: string;
  fullName!: string;
  private!: boolean;

  description!: string | null;
  language!: string | null;

  stars!: number;
  forks!: number;

  updatedAt!: Date;

  hashCode!: string;
  version!: number;

  createdAt!: Date ;
  updatedAtRecord!: Date ;

  isActiveVersion!: boolean;
  isDeleted!: boolean;
}