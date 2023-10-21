import { join } from 'path';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { Observable, lastValueFrom } from 'rxjs';

type Order = {
  order_id: string;
  account_id: string;
  asset_id: string;
  quantity: number;
  status: string;
};

interface OrderGrpcClient {
  createOrder(
    data: Omit<Order, 'order_id' | 'status'>,
    metadata?: Metadata,
  ): Observable<{
    order: Order;
  }>;
  findAllOrders(
    data: Pick<Order, 'account_id'>,
    metadata?: Metadata,
  ): Observable<{ orders: Order[] }>;
  findOneOrder(
    data: Pick<Order, 'order_id'>,
    metadata?: Metadata,
  ): Observable<{
    order: Order;
  }>;
}

@Injectable()
export class OrdersService implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'fullcycle',
      protoPath: [join(__dirname, 'orders', 'proto', 'orders.proto')],
      loader: { keepCase: true },
    },
  })
  clientGrpc: ClientGrpc;
  private orderGrpcClient: OrderGrpcClient;

  onModuleInit() {
    this.orderGrpcClient = this.clientGrpc.getService('OrderService');
  }

  async create(createOrderDto: CreateOrderDto) {
    const metadata = new Metadata();
    metadata.add('authorization', 'Bearer 1234');
    const result = await lastValueFrom(
      this.orderGrpcClient.createOrder(createOrderDto, metadata),
    );

    return result.order;
  }

  async findAll(account_id: string) {
    const result = await lastValueFrom(
      this.orderGrpcClient.findAllOrders({ account_id }),
    );
    return result.orders;
  }

  async findOne(order_id: string) {
    const result = await lastValueFrom(
      this.orderGrpcClient.findOneOrder({ order_id }),
    );
    return result.order;
  }
}
