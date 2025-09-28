import { Module } from '@nestjs/common';
import { SearchController } from './api/http/search.controller';
import { SearchUseCase } from './app/usecases/search.usecase';
import { REPOSITORY_GATEWAY } from './app/ports/tokens';
import { GithubRepositoryGateway } from './infra/github/github.gateway';
import { ScoreService } from './services/score.service';

@Module({
  controllers: [SearchController],
  providers: [
    ScoreService,
    SearchUseCase,
    GithubRepositoryGateway,
    { provide: REPOSITORY_GATEWAY, useExisting: GithubRepositoryGateway },
  ],
  exports: [],
})
export class SearchModule {}
