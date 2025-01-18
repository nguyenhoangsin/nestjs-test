import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from '../../database/mysql/entities/location.entity';
import { Device } from '../../database/mysql/entities/device.entity';
import { CronService } from './cron.service';
import { CronController } from './cron.controller';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([Location, Device])],
  providers: [CronService],
  controllers: [CronController],
})
export class CronModule {}
