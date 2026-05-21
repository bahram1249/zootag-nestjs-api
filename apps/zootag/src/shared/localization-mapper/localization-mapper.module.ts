import { Global, Module } from '@nestjs/common';
import { LocalizationMapperService } from './localization-mapper.service';

@Global()
@Module({
  providers: [LocalizationMapperService],
  exports: [LocalizationMapperService],
})
export class LocalizationMapperModule {}
