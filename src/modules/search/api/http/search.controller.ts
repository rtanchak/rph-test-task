import { Controller, Get, Query } from '@nestjs/common';
import { SearchReposQueryDto } from '../../dto/search-repos.query';
import { SearchResponseDto } from '../../dto/repo.dto';

@Controller('api/repos')
export class SearchController {
  @Get('search')
  async search(@Query() query: SearchReposQueryDto): Promise<SearchResponseDto> {
    return {
      total: 1,
      items: [
        {
          id: 1,
          fullName: 'octocat/Hello-World',
          htmlUrl: 'https://github.com/octocat/Hello-World',
          description: 'Example repository',
          stars: 42,
          forks: 7,
          updatedAt: new Date().toISOString(),
          language: query.language ?? 'TypeScript',
          score: 0,
        },
      ],
    };
  }
}
