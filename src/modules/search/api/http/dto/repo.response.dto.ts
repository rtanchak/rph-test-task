import { ApiProperty } from '@nestjs/swagger';

export class RepoResponseDto {
  @ApiProperty() id!: number;
  @ApiProperty() fullName!: string;
  @ApiProperty() htmlUrl!: string;
  @ApiProperty({ required: false }) description?: string;
  @ApiProperty() stars!: number;
  @ApiProperty() forks!: number;
  @ApiProperty({ description: 'ISO timestamp of last update' }) updatedAt!: string;
  @ApiProperty({ required: false }) language?: string;
  @ApiProperty({ description: 'Computed popularity score' }) score!: number;
}

export class SearchResponseDto {
  @ApiProperty() total!: number;
  @ApiProperty({ type: [RepoResponseDto] }) items!: RepoResponseDto[];
}
