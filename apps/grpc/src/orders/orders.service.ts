import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Model } from 'mongoose';
import { Order } from './entities/order.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private orderModule: Model<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const createdOrder = await this.orderModule.create({
      ...createOrderDto,
      status: 'PENDING',
    });

    return {
      order: {
        order_id: createdOrder.id.toString(),
        account_id: createdOrder.account_id,
        asset_id: createdOrder.asset_id,
        quantity: createdOrder.quantity,
        status: createdOrder.status,
      },
    };
  }

  async findAll(account_id: string) {
    const orders = await this.orderModule.find({ account_id });

    return {
      orders: orders.map((order) => ({
        order_id: order.id.toString(),
        account_id: order.account_id,
        asset_id: order.asset_id,
        quantity: order.quantity,
        status: order.status,
      })),
    };
  }

  async findOne(id: string) {
    const order = await this.orderModule.findById(id);
    return {
      order: {
        order_id: order.id.toString(),
        account_id: order.account_id,
        asset_id: order.asset_id,
        quantity: order.quantity,
        status: order.status,
      },
    };
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
