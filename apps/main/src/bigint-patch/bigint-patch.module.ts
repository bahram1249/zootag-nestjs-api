import { Module } from '@nestjs/common';
import { BigintPatchService } from './bigint-patch.service';

@Module({
  providers: [BigintPatchService],
})
export class BigintPatchModule {}
