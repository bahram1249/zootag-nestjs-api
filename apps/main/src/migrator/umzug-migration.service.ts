import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';

interface MigrationDefinition {
  name: string;
  up: (sequelize: Sequelize) => Promise<void>;
  down?: (sequelize: Sequelize) => Promise<void>;
}

@Injectable()
export class UmzugMigrationService {
  private readonly logger = new Logger(UmzugMigrationService.name);
  private umzug: Umzug;
  private seedUmzug: Umzug;

  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  private getStorage(tableName = 'UmzugMeta') {
    return new SequelizeStorage({
      sequelize: this.sequelize,
      tableName,
    });
  }

  async runMigrations(definitions: MigrationDefinition[]): Promise<void> {
    if (definitions.length === 0) {
      this.logger.log('No migration definitions provided.');
      return;
    }

    this.umzug = new Umzug({
      migrations: definitions.map((def) => ({
        name: def.name,
        up: async () => {
          this.logger.log(`Running migration: ${def.name}`);
          await def.up(this.sequelize);
        },
        down: async () => {
          if (def.down) {
            await def.down(this.sequelize);
          }
        },
      })),
      storage: this.getStorage('UmzugMeta'),
      context: this.sequelize,
      logger: {
        info: (msg) => this.logger.log(String(msg)),
        warn: (msg) => this.logger.warn(String(msg)),
        error: (msg) => this.logger.error(String(msg)),
        debug: (msg) => this.logger.debug(String(msg)),
      },
    });

    await this.umzug.up();
  }

  async runSeeds(definitions: MigrationDefinition[]): Promise<void> {
    if (definitions.length === 0) {
      this.logger.log('No seed definitions provided.');
      return;
    }

    this.seedUmzug = new Umzug({
      migrations: definitions.map((def) => ({
        name: def.name,
        up: async () => {
          this.logger.log(`Running seed: ${def.name}`);
          await def.up(this.sequelize);
        },
        down: async () => {
          if (def.down) {
            await def.down(this.sequelize);
          }
        },
      })),
      storage: this.getStorage('UmzugSeedMeta'),
      context: this.sequelize,
      logger: {
        info: (msg) => this.logger.log(String(msg)),
        warn: (msg) => this.logger.warn(String(msg)),
        error: (msg) => this.logger.error(String(msg)),
        debug: (msg) => this.logger.debug(String(msg)),
      },
    });

    await this.seedUmzug.up();
  }

  async rollbackLastMigration(): Promise<void> {
    if (this.umzug) {
      await this.umzug.down();
    }
  }

  async pendingMigrations(): Promise<string[]> {
    if (this.umzug) {
      const pending = await this.umzug.pending();
      return pending.map((m) => m.name);
    }
    return [];
  }

  async executedMigrations(): Promise<string[]> {
    if (this.umzug) {
      const executed = await this.umzug.executed();
      return executed.map((m) => m.name);
    }
    return [];
  }

  async status(): Promise<{
    pending: string[];
    executed: string[];
  }> {
    return {
      pending: await this.pendingMigrations(),
      executed: await this.executedMigrations(),
    };
  }
}
