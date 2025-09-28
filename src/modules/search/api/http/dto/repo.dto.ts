export class RepoDto {
    id!: number;
    fullName!: string;
    htmlUrl!: string;
    description?: string;
    stars!: number;
    forks!: number;
    updatedAt!: string; // ISO
    language?: string;
    score!: number; // з'явиться у кроці зі скорингом
  }
  
  export class SearchResponseDto {
    total!: number;
    items!: RepoDto[];
  }
  