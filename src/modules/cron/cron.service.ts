import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import axios from 'axios';
import { Location } from '../../database/mysql/entities/location.entity';
import { Device } from '../../database/mysql/entities/device.entity';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  private isCronActive = true; // Cron job status (default on)

  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
    private dataSource: DataSource,
  ) {}

  // Cron job runs every day at 0:00 GMT
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: 'dailySync' })
  async syncAssets() {
    if (!this.isCronActive) {
      this.logger.log('Cron job is currently stopped!');
      return;
    }

    try {
      this.logger.log('Cron job started!');
      const response = await axios.get('https://669ce22d15704bb0e304842d.mockapi.io/assets');
      const assets = response.data;

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        for (const asset of assets) {
          // Synchronize assets when the location already exists in the database and status equal active
          const location = await this.locationRepository.findOne({
            where: { locationId: asset.location_id, status: true },
          });

          if (location) {
            const createdAt = new Date(asset.created_at * 1000);
            // Only sync assets created in the past
            if (createdAt < new Date()) {
              const existingDevice = await this.deviceRepository.findOne({
                where: { serial: asset.serial },
              });

              if (existingDevice) {
                // Update asset if it already exists
                existingDevice.type = asset.type;
                existingDevice.status = asset.status === 'actived';
                existingDevice.description = asset.description;
                existingDevice.updatedAt = new Date(asset.updated_at * 1000);

                await queryRunner.manager.save(existingDevice);
              } else {
                // Add new asset if it does not exist
                const newDevice = this.deviceRepository.create({
                  type: asset.type,
                  serial: asset.serial,
                  status: asset.status === 'actived',
                  description: asset.description,
                  createdAt,
                  updatedAt: new Date(asset.updated_at * 1000),
                  location,
                });

                await queryRunner.manager.save(newDevice);
              }
            }
          }
        }

        await queryRunner.commitTransaction();
        this.logger.log('Cron job finished successfully!');
      } catch (err) {
        await queryRunner.rollbackTransaction();
        this.logger.error('Error during cron job!', err);
        throw err;
      } finally {
        await queryRunner.release();
      }
    } catch (err) {
      this.logger.error('Error fetching assets!', err);
    }
  }

  // Enable cron job
  startCron(): string {
    if (this.isCronActive) {
      return 'Cron job is already running';
    }
    this.isCronActive = true;
    return 'Cron job has been started';
  }

  // Stop cron job
  stopCron(): string {
    if (!this.isCronActive) {
      return 'Cron job is already stopped';
    }
    this.isCronActive = false;
    return 'Cron job has been stopped';
  }

  // Method to run cron immediately
  async runSyncNow(): Promise<string> {
    try {
      await this.syncAssets();
      return 'Sync completed successfully';
    } catch (error) {
      return `Sync failed: ${error.message}`;
    }
  }
}
