import { Module, Global } from '@nestjs/common';
import { MySQLModule } from './mysql/mysql.module';

@Global()
@Module({
  imports: [MySQLModule],
  exports: [MySQLModule],
})
export class DatabaseModule {}
