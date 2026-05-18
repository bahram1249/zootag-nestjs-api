import { DynamicModule, Module } from '@nestjs/common';
import { bpmnProviders } from './providers/bpmn.providers';
import { zootagProviders } from './providers/zootag.providers';

@Module({})
export class DynamicProviderModule {
  static register(): DynamicModule {
    let imports = [];
    if (process.env.PROJECT_NAME == 'BPMN') {
      imports = bpmnProviders;
    } else if (process.env.PROJECT_NAME == 'Zootag') {
      imports = zootagProviders;
    }

    return {
      module: DynamicProviderModule,
      imports: imports,
      exports: imports,
    };
  }
}
