import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class MySQLService implements OnModuleInit {
  private readonly logger = new Logger('MySQL');

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  onModuleInit() {
    this.dataSource.driver
      .connect()
      .then(() => {
        this.logger.log('Connected!');
      })
      .catch((error) => {
        this.logger.error(JSON.stringify(error));
      });
  }
}
