import { Module } from '@nestjs/common';
import { BpmnInitializerService, ZootagInitializerService } from './services';
import { UmzugMigrationModule } from '../migrator';

@Module({
  imports: [UmzugMigrationModule],
  providers: [
    {
      provide: 'ZootagInitializerService',
      useClass: ZootagInitializerService,
    },
    {
      provide: 'BpmnInitializerService',
      useClass: BpmnInitializerService,
    },
  ],
})
export class ModuleInitializerModule {}
