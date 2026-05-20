import { Injectable } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ModuleInitializerServiceInterface } from '../interface';
import { CoreModule } from '@rahino/core';
import { UmzugMigrationService } from '../../migrator';
import { migrations } from '../../migrator/migrations';
import { seeds } from '../../migrator/seeds';
import { ZootagModule } from '@rahino/zootag';

@Injectable()
export class ZootagInitializerService
  implements ModuleInitializerServiceInterface
{
  constructor(private readonly umzugMigrationService: UmzugMigrationService) {}
  async init(app: NestExpressApplication) {
    app.get(CoreModule).setApp(app);
    app.get(ZootagModule).setApp(app);
  }

  async runOnPrimaryClustred(app: NestExpressApplication) {
    await this.umzugMigrationService.runMigrations(migrations);
    await this.umzugMigrationService.runSeeds(seeds);
  }
}
