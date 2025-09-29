import { IsInt, IsOptional, IsString, Min, Max, Matches } from 'class-validator';

export class SearchReposQueryDto {
  @IsString()
  query!: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'created_after must be YYYY-MM-DD' })
  created_after?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  per_page: number = 20;
}
