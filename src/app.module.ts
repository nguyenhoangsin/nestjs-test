import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { GlobalResponseInterceptor } from './common/interceptors/global-response.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { DatabaseModule } from './database/database.module';
import { CronModule } from './modules/cron/cron.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    CronModule,
  ],
  controllers: [],
  providers: [
    {
      // Standardize Exception
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      // Standardize Response
      provide: APP_INTERCEPTOR,
      useClass: GlobalResponseInterceptor,
    },
  ],
})
export class AppModule {}
