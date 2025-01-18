import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../entities/location.entity';

@Injectable()
export class LocationSeed {
  private readonly logger = new Logger(`MySQL:${LocationSeed.name}`);

  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async seed() {
    // Check if the table already has data
    const count = await this.locationRepository.count();
    if (count > 0) {
      this.logger.log('Locations table already seeded. No action taken!');
      return;
    }

    // Seed data
    const locations: Partial<Location>[] = [
      { locationId: 1, name: 'Da Nang', organization: 'PNS', status: true },
      { locationId: 2, name: 'Ha Noi', organization: 'PNS', status: false },
      { locationId: 3, name: 'Ho Chi Minh', organization: 'PNS', status: true },
      { locationId: 4, name: 'Nha Trang', organization: 'PLJ', status: true },
      { locationId: 5, name: 'Can Tho', organization: 'PLJ', status: true },
    ];

    // Save records to table
    await this.locationRepository.save(locations);
    this.logger.log('Locations table seeded successfully!');
  }
}
