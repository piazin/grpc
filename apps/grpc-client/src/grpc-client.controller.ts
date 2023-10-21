import { Controller, Get } from '@nestjs/common';
import { GrpcClientService } from './grpc-client.service';

@Controller()
export class GrpcClientController {
  constructor(private readonly grpcClientService: GrpcClientService) {}

  @Get()
  getHello(): string {
    return this.grpcClientService.getHello();
  }
}
