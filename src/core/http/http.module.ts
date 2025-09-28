import { Global, Module } from '@nestjs/common';
import { HttpClient } from './http.client';

@Global()
@Module({
  providers: [
    {
      provide: HttpClient,
      useFactory: () => new HttpClient(),
    },
  ],
  exports: [HttpClient],
})
export class HttpModule {}
