import { Injectable } from '@nestjs/common';
import { TryExecuteActionDto } from './dto';
import { ModuleRef } from '@nestjs/core';
import { ActionServiceImp } from '../action/interface';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class ActionLoaderService {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly localizationService: LocalizationService,
  ) {}

  async tryExecuteAction(dto: TryExecuteActionDto): Promise<boolean> {
    const serviceInstance: ActionServiceImp =
      await this.moduleRef.get<ActionServiceImp>(dto.source, {
        strict: false,
      });

    if (!serviceInstance) {
      throw new Error(
        this.localizationService.translate('bpmn.action_not_found') as string,
      );
    }

    // Execute the action
    return await serviceInstance.executeAction(dto.sourceExecuteAction);
  }
}
