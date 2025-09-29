import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SearchQueryDto } from './dto/search.query.dto';
import { SearchResponseDto } from './dto/repo.response.dto';
import { SearchUseCase } from '../../app/usecases/search.usecase';

@ApiTags('repos')
@ApiBearerAuth('github-token')
@Controller('api/repos')
export class SearchController {
  constructor(private readonly searchUseCase: SearchUseCase) {}

  @Get('search')
  @ApiOkResponse({ type: SearchResponseDto })
  async search(@Query() q: SearchQueryDto): Promise<SearchResponseDto> {
    const response = await this.searchUseCase.execute({
      query: q.query,
      language: q.language,
      createdAfter: q.created_after,
      page: q.page,
      perPage: q.per_page,
    });
    return response;
  }
}
