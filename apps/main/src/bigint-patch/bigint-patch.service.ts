import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class BigintPatchService implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    (BigInt.prototype as any).toJSON = function () {
      return Number(this);
    };

    const { DataTypes } = require('sequelize');
    const mssqlParserStore = require('sequelize/lib/dialects/parserStore')(
      'mssql',
    );

    DataTypes.BIGINT.types.mssql = [127, 38];
    DataTypes.BIGINT.parse = (value: unknown) =>
      typeof value === 'string' ? Number(value) : value;
    mssqlParserStore.refresh(DataTypes.BIGINT);
  }
}
