import { Module } from '@nestjs/common';
import { SearchController } from './api/http/search.controller';

@Module({
  controllers: [SearchController],
})
export class SearchModule {}
