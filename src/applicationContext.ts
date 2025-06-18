import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PurchaseReceiptsModule } from './modules/purchase-receipts/purchase-receipts.module';
import { PurchaseReceiptsService } from './modules/purchase-receipts/purchase-receipts.service';

const applicationContext: Promise<{
  purchaseReceiptsService: PurchaseReceiptsService
}> =
  NestFactory.createApplicationContext(AppModule).then((app) => {
    return {
      purchaseReceiptsService: app.select(PurchaseReceiptsModule).get(PurchaseReceiptsService)
    };
  });

export default applicationContext;
