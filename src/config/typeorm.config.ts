import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: ['src/database/mysql/entities/*.entity.ts'],
  migrations: ['src/database/mysql/migrations/*-migration.ts'],
  synchronize: false,
  migrationsRun: false,
  logging: true,
});

export default AppDataSource;
