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

@Module({
  imports: [
    CurrencyCalculationModule,
    CurrencyModule,
    CompanyModule,
    DeviceTypeModule,
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
