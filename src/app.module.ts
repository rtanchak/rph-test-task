import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import configuration from './config/configurations';
import { HealthController } from './modules/health/health.controller';
import { SearchModule } from './modules/search/search.module';
import { HttpModule } from './core/http/http.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
      },
    }),
    SearchModule,
    HttpModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
