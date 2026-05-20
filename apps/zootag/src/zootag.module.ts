import {
  INestApplication,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CurrencyModule } from './admin/currency/currency.module';
import { CurrencyCalculationModule } from './shared/currency-calculation/currency-calculation.module';
import { CompanyModule } from './admin/company/company.module';
import { DeviceTypeModule } from './admin/device-type/device-type.module';
import { DeviceStatusModule } from './admin/device-status/device-status.module';
import { ContractStatusModule } from './admin/contract-status/contract-status.module';
import { ContractPeriodStatusModule } from './admin/contract-period-status/contract-period-status.module';
import { ContractModule } from './admin/contract/contract.module';
import { ContractPeriodModule } from './admin/contract-period/contract-period.module';
import { ContractPeriodDevicePriceModule } from './admin/contract-period-device-price/contract-period-device-price.module';
import { DeviceModule } from './admin/device/device.module';

@Module({
  imports: [
    CurrencyCalculationModule,
    CurrencyModule,
    CompanyModule,
    DeviceTypeModule,
    DeviceStatusModule,
    ContractStatusModule,
    ContractPeriodStatusModule,
    ContractModule,
    ContractPeriodModule,
    ContractPeriodDevicePriceModule,
    DeviceModule,
  ],
})
export class ZootagModule implements NestModule {
  constructor() {}
  private app: INestApplication;
  configure(consumer: MiddlewareConsumer) {}
  setApp(app: INestApplication<any>) {
    this.app = app;
    const coreConfig = new DocumentBuilder()
      .setTitle('Zootag Api')
      .setDescription('The Zootag API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const coreDocument = SwaggerModule.createDocument(this.app, coreConfig, {
      include: [ZootagModule],
      deepScanRoutes: true,
    });
    SwaggerModule.setup('api/zootag', this.app, coreDocument);
  }
}
