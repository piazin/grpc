import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { MongooseModule } from '@nestjs/mongoose';

const dns = 'mongodb://localhost:27013/b3';

@Module({
  imports: [MongooseModule.forRoot(dns), OrdersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
