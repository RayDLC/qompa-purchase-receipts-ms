import { Module } from '@nestjs/common';
import { PurchaseReceiptsModule } from './modules/purchase-receipts/purchase-receipts.module';

@Module({
  imports: [PurchaseReceiptsModule],
})
export class AppModule {}
