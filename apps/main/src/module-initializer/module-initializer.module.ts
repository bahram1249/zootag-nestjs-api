import { Module } from '@nestjs/common';
import { BpmnInitializerService, ZootagInitializerService } from './services';
import { ScriptRunnerModule } from '../script-runner';

@Module({
  imports: [ScriptRunnerModule],
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
