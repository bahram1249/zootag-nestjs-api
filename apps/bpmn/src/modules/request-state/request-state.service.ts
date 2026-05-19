import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  BPMNActivity,
  BPMNRequest,
  BPMNRequestState,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import { Transaction } from 'sequelize';
import { InitRequestDto } from './dto';

@Injectable()
export class RequestStateService {
  constructor(
    @InjectModel(BPMNRequestState)
    private readonly requestStateRepository: typeof BPMNRequestState,
    @InjectModel(BPMNActivity)
    private readonly activityRepository: typeof BPMNActivity,
    private readonly localizationService: LocalizationService,
  ) {}

  public async initRequestState(dto: InitRequestDto) {
    // check if exists start activity
    const startActivity = await this.activityRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ processId: dto.processId })
        .filter({ isStartActivity: true })
        .build(),
    );
    if (!startActivity) {
      throw new BadRequestException(
        [
          this.localizationService.translate('bpmn.activity'),
          this.localizationService.translate('core.not_found'),
        ].join(' '),
      );
    }
    // create first request state
    return await this.requestStateRepository.create(
      {
        requestId: dto.request.id,
        userId: dto.userId || dto.request.userId,
        organizationId: dto.request.organizationId,
        activityId: startActivity.id,
        returnRequestStateId: dto.returnRequestStateId,
      },
      {
        transaction: dto.transaction,
      },
    );
  }
}
