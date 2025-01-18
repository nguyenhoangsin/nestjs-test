import { Controller, Post } from '@nestjs/common';
import { CronService } from './cron.service';

@Controller('cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}

  // Endpoint to run cron immediately and return result
  @Post('run-now')
  async runSyncNow() {
    const result = await this.cronService.runSyncNow();
    return { message: result };
  }

  // Endpoint to start cron job (Cron runs automatically every day)
  @Post('start')
  startCron() {
    const message = this.cronService.startCron();
    return { message };
  }
  // Endpoint to stop cron job (Just stop cron job during runtime)
  @Post('stop')
  stopCron() {
    const message = this.cronService.stopCron();
    return { message };
  }
}
