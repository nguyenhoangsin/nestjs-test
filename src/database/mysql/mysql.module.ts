import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MySQLService } from './mysql.service';
import { Location } from './entities/location.entity';
import { Device } from './entities/device.entity';
import { LocationSeed } from './seeds/location.seed';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('MYSQL_HOST'),
        port: Number(configService.get<number>('MYSQL_PORT')),
        username: configService.get<string>('MYSQL_USER'),
        password: configService.get<string>('MYSQL_PASSWORD'),
        database: configService.get<string>('MYSQL_DATABASE'),
        entities: [__dirname + '/entities/*{.ts,.js}'], // Path of entities
        migrations: [__dirname + '/migrations/*{.ts,.js}'], // Path of migrations
        synchronize: true, // Syncs the database schema with entities on startup (should be disabled in production environment)
        migrationsRun: false, // Runs pending migrations on startup
        logging: false, // Enable SQL log (can be disabled in production)
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Location, Device]), // Make sure entities are imported
  ],
  providers: [MySQLService, LocationSeed],
  exports: [TypeOrmModule], // Export TypeOrmModule so it can be used in other modules
})
export class MySQLModule {
  constructor(private readonly locationSeed: LocationSeed) {
    // Seed data is only created if the table has no data yet
    this.locationSeed.seed();
  }
}
