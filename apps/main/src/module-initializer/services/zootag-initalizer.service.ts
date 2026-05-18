import { Injectable } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ModuleInitializerServiceInterface } from '../interface';
import { CoreModule } from '@rahino/core';
import { ScriptRunnerService } from '../../script-runner';

@Injectable()
export class ZootagInitializerService
  implements ModuleInitializerServiceInterface
{
  constructor(private readonly scriptRunnerService: ScriptRunnerService) {}
  async init(app: NestExpressApplication) {
    app.get(CoreModule).setApp(app);
  }

  async runOnPrimaryClustred(app: NestExpressApplication) {
    await this.runScripts();
  }

  private async runScripts() {
    await this.scriptRunnerService.runFromPath(
      './apps/main/src/sql/Core/Core-V1.sql',
    );
    await this.scriptRunnerService.runFromPath(
      './apps/main/src/sql/Core/Core-Data.sql',
    );

    await this.scriptRunnerService.runFromPath(
      './apps/main/src/sql/Core/Core-Permission.sql',
    );
  }
}
