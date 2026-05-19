import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { QueryTypes, Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import { createDialectHelpers } from './migration-helper';

interface Condition {
  key: string;
  values: string[];
}

interface MigrationDefinition {
  name: string;
  up: (sequelize: Sequelize) => Promise<void>;
  down?: (sequelize: Sequelize) => Promise<void>;
  condition?: Condition;
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

  private async runUmzug(
    definitions: MigrationDefinition[],
    storageTableName: string,
  ): Promise<Umzug> {
    const umzug = new Umzug({
      migrations: definitions.map((def) => ({
        name: def.name,
        up: async () => {
          this.logger.log(`Running: ${def.name}`);
          await def.up(this.sequelize);
        },
        down: async () => {
          if (def.down) await def.down(this.sequelize);
        },
      })),
      storage: this.getStorage(storageTableName),
      context: this.sequelize,
      logger: {
        info: (msg) => this.logger.log(String(msg)),
        warn: (msg) => this.logger.warn(String(msg)),
        error: (msg) => this.logger.error(String(msg)),
        debug: (msg) => this.logger.debug(String(msg)),
      },
    });
    await umzug.up();
    return umzug;
  }

  private async getSettingValues(keys: string[]): Promise<Map<string, string>> {
    const result = new Map<string, string>();
    const { top, quote } = createDialectHelpers(this.sequelize);
    for (const key of keys) {
      try {
        const row: any = await this.sequelize.query(
          top(
            1,
            `SELECT ${quote('value')} FROM Settings WHERE ${quote('key')} = '${key}'`,
          ),
          { raw: true, type: QueryTypes.SELECT },
        );
        if (row?.[0]) result.set(key, row[0].value);
      } catch {
        /* table or key might not exist yet */
      }
    }
    return result;
  }

  private async runConditionalPhase(
    definitions: MigrationDefinition[],
    storageTableName: string,
  ): Promise<Umzug | null> {
    const core = definitions.filter((d) => !d.condition);
    const conditional = definitions.filter((d) => d.condition);
    let last: Umzug | null = null;
    if (core.length > 0) {
      last = await this.runUmzug(core, storageTableName);
    }
    if (conditional.length > 0) {
      const uniqueKeys = [...new Set(conditional.map((d) => d.condition!.key))];
      const settingValues = await this.getSettingValues(uniqueKeys);
      const matching = conditional.filter((d) => {
        const currentValue = settingValues.get(d.condition!.key);
        return currentValue && d.condition!.values.includes(currentValue);
      });
      if (matching.length > 0) {
        last = await this.runUmzug(matching, storageTableName);
      }
    }
    return last;
  }

  async runMigrations(definitions: MigrationDefinition[]): Promise<void> {
    if (definitions.length === 0) {
      this.logger.log('No migration definitions provided.');
      return;
    }
    this.umzug = await this.runConditionalPhase(definitions, 'UmzugMeta');
  }

  async runSeeds(definitions: MigrationDefinition[]): Promise<void> {
    if (definitions.length === 0) {
      this.logger.log('No seed definitions provided.');
      return;
    }
    this.seedUmzug = await this.runConditionalPhase(
      definitions,
      'UmzugSeedMeta',
    );
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
