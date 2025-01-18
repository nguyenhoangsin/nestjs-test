import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateDevicesTable implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'devices',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'type', type: 'varchar' },
          { name: 'serial', type: 'varchar', isUnique: true },
          { name: 'status', type: 'boolean', default: false },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'location_id', type: 'int' },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'devices',
      new TableForeignKey({
        columnNames: ['location_id'],
        referencedColumnNames: ['locationId'],
        referencedTableName: 'locations',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('devices');
  }
}
