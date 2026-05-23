import {
  INestApplication,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CurrencyModule } from './admin/currency/currency.module';
import { CurrencyHistoryModule } from './admin/currency-history/currency-history.module';
import { CurrencyCalculationModule } from './shared/currency-calculation/currency-calculation.module';
import { LocalizationMapperModule } from './shared/localization-mapper/localization-mapper.module';
import { CompanyModule } from './admin/company/company.module';
import { DeviceTypeModule } from './admin/device-type/device-type.module';
import { DeviceStatusModule } from './admin/device-status/device-status.module';
import { ContractStatusModule } from './admin/contract-status/contract-status.module';
import { ContractPeriodStatusModule } from './admin/contract-period-status/contract-period-status.module';
import { ContractModule } from './admin/contract/contract.module';
import { ContractPeriodModule } from './admin/contract-period/contract-period.module';
import { ContractPeriodDevicePriceModule } from './admin/contract-period-device-price/contract-period-device-price.module';
import { DeviceModule } from './admin/device/device.module';
import { ManufacturerModule } from './admin/manufacturer/manufacturer.module';
import { MarketerModule } from './admin/marketer/marketer.module';
import { DeviceSalePriceModule } from './admin/device-sale-price/device-sale-price.module';
import { DeviceSaleModule } from './admin/device-sale/device-sale.module';
import { CommissionSettlementModule } from './admin/commission-settlement/commission-settlement.module';
import { CommissionTypeModule } from './admin/commission-type/commission-type.module';
import { CommissionSettlementStatusModule } from './admin/commission-settlement-status/commission-settlement-status.module';
import { InventoryStatusModule } from './admin/inventory-status/inventory-status.module';

@Module({
  imports: [
    CurrencyCalculationModule,
    LocalizationMapperModule,
    CurrencyModule,
    CurrencyHistoryModule,
    CompanyModule,
    DeviceTypeModule,
    DeviceStatusModule,
    ContractStatusModule,
    ContractPeriodStatusModule,
    ContractModule,
    ContractPeriodModule,
    ContractPeriodDevicePriceModule,
    DeviceModule,
    ManufacturerModule,
    MarketerModule,
    DeviceSalePriceModule,
    DeviceSaleModule,
    CommissionSettlementModule,
    CommissionTypeModule,
    CommissionSettlementStatusModule,
    InventoryStatusModule,
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
