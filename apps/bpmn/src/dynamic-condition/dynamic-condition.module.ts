import { Module } from '@nestjs/common';

// this module made only for exporting all files in dist folder

@Module({
  imports: [],
  exports: [],
})
export class DynamicConditionModule {}
