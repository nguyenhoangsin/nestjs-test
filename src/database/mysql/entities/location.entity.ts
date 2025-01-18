import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Device } from './device.entity';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  locationId: number;

  @Column()
  name: string;

  @Column()
  organization: string;

  @Column({ default: false })
  status: boolean;

  @OneToMany(() => Device, (device) => device.location)
  devices: Device[];
}
