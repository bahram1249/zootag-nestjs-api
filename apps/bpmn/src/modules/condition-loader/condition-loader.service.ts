import { Injectable } from '@nestjs/common';
import { ExecuteConditionDto } from './dto';
import { ModuleRef } from '@nestjs/core';
import { ConditionServiceImp } from '../condition/interface';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class ConditionLoaderService {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly localizationService: LocalizationService,
  ) {}

  async executeCondition(dto: ExecuteConditionDto): Promise<boolean> {
    const serviceInstance: ConditionServiceImp =
      await this.moduleRef.get<ConditionServiceImp>(dto.source, {
        strict: false,
      });

    if (!serviceInstance) {
      throw new Error(
        this.localizationService.translate(
          'bpmn.condition_not_found',
        ) as string,
      );
    }

    // Execute the action
    return await serviceInstance.check({
      node: dto.checkCondition.node,
      request: dto.checkCondition.request,
      requestState: dto.checkCondition.requestState,
      transaction: dto.checkCondition.transaction,
    });
  }
}
