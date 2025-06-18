import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../core/database.module';
import { PurchaseReceiptsService } from './purchase-receipts.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DatabaseModule, HttpModule],
  providers: [PurchaseReceiptsService]
})
export class PurchaseReceiptsModule {}