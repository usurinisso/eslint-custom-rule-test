import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'auth/jwt-auth-guard';
import { ApiErrorFilter } from 'exception/api-error-filter';
import { ErrorStatus } from 'exception/error-status';
import { OrderNotFoundError } from 'exceptions/order-not-found';
import { HttpErrorItem } from 'resources/http-error-item';
import { Order } from 'resources/order';
import { OrderService } from 'services/order';
import { RoleType } from 'types/roleType';
import { CreateOrderBody } from 'validators/order/createOrderBody';
import { UpdateOrderBody } from 'validators/order/updateOrderBody';

@ApiTags('orders')
@Controller('orders')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
@UseFilters(new ApiErrorFilter())
export class OrdersController {
  constructor(private readonly ordersService: OrderService) {}

  @Get('/:id')
  @ApiResponse({ status: HttpStatus.OK, type: Order })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: HttpErrorItem })
  @ErrorStatus(OrderNotFoundError, HttpStatus.NOT_FOUND)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getOne(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Order> {
    const userOrders = await this.ordersService.findAllUserOrders(req.user.userId);

    if (
      userOrders.some((order) => order.id === id) ||
      req.user.role === RoleType.admin ||
      req.user.role === RoleType.vendor
    ) {
      return Order.from(await this.ordersService.findOneOrder(id));
    } else {
      throw new UnauthorizedException();
    }
  }

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: [Order] })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: HttpErrorItem })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getAll(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    @Request() req,
  ): Promise<Order[]> {
    if (req.user.role === RoleType.admin || req.user.role === RoleType.vendor) {
      return (await this.ordersService.findAllOrders()).map(Order.from);
    } else {
      console.log(await this.ordersService.findAllUserOrders(req.user.userId));
      return (await this.ordersService.findAllUserOrders(req.user.userId)).map(Order.from);
    }
  }

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: Order })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: HttpErrorItem })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async post(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    @Request() req,
    @Body() order: CreateOrderBody,
  ): Promise<Order> {
    if (req.user.role === RoleType.admin || req.user.role === RoleType.vendor || order.userId === req.user.userId) {
      return Order.from(await this.ordersService.createOrder(order));
    } else {
      throw new UnauthorizedException();
    }
  }

  @Patch('/:id')
  @ApiResponse({ status: HttpStatus.OK, type: UpdateOrderBody })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: HttpErrorItem })
  @ErrorStatus(OrderNotFoundError, HttpStatus.NOT_FOUND)
  @ApiBody({ type: UpdateOrderBody })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async patch(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() order: UpdateOrderBody,
  ): Promise<Order> {
    if (req.user.role === RoleType.admin || req.user.role === RoleType.vendor) {
      return Order.from(await this.ordersService.updateOrder(id, order));
    } else {
      throw new UnauthorizedException();
    }
  }

  @Delete('/:id')
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: HttpErrorItem })
  @ErrorStatus(OrderNotFoundError, HttpStatus.NOT_FOUND)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async delete(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    if (req.user.role === RoleType.admin) {
      await this.ordersService.deleteOrder(id);
    } else {
      throw new UnauthorizedException();
    }
  }
}
