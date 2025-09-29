import { IsInt, IsOptional, IsString, Matches, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchQueryDto {
  @ApiProperty({ description: 'Search string for GitHub', example: 'nestjs cache' })
  @IsString()
  query!: string;

  @ApiPropertyOptional({ example: 'typescript' })
  @IsOptional() @IsString()
  language?: string;

  @ApiPropertyOptional({ description: 'Earliest created date (YYYY-MM-DD)', example: '2023-01-01' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'created_after must be YYYY-MM-DD' })
  created_after?: string;

  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @IsOptional() @IsInt() @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ minimum: 1, maximum: 50, default: 20 })
  @IsOptional() @IsInt() @Min(1) @Max(50)
  per_page: number = 20;
}
