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
import { CartNotFoundError } from 'exceptions/cart-not-found';
import { Cart } from 'resources/cart';
import { HttpErrorItem } from 'resources/http-error-item';
import { CartService } from 'services/cart';
import { RoleType } from 'types/roleType';
import { CreateCartBody } from 'validators/cart/createCartBody';
import { UpdateCartBody } from 'validators/cart/updateCartBody';

@ApiTags('carts')
@Controller('carts')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
@UseFilters(new ApiErrorFilter())
export class CartController {
  constructor(private readonly cartsService: CartService) {}

  @Get('/:id')
  @ApiResponse({ status: HttpStatus.OK, type: Cart })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: HttpErrorItem })
  @ErrorStatus(CartNotFoundError, HttpStatus.NOT_FOUND)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getOne(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Cart> {
    const userCarts = await this.cartsService.findAllCartsByUser(req.user.userId);
    if (
      userCarts.some((cart) => cart.id === id) ||
      req.user.role === RoleType.admin ||
      req.user.role === RoleType.vendor
    ) {
      return Cart.from(await this.cartsService.findOneCart(id));
    } else {
      throw new UnauthorizedException();
    }
  }

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: [Cart] })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: HttpErrorItem })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getAll(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    @Request() req,
  ): Promise<Cart[]> {
    if (req.user.role === RoleType.admin || req.user.role === RoleType.vendor) {
      return (await this.cartsService.findAllCarts()).map(Cart.from);
    } else {
      return (await this.cartsService.findAllCartsByUser(req.user.userId)).map(Cart.from);
    }
  }

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: Cart })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: HttpErrorItem })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async post(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    @Request() req,
    @Body() cart: CreateCartBody,
  ): Promise<Cart> {
    if (req.user.role === RoleType.admin || req.user.role === RoleType.vendor || cart.userId === req.user.userId) {
      return Cart.from(await this.cartsService.createCart(cart));
    } else {
      throw new UnauthorizedException();
    }
  }

  @Patch('/:id')
  @ApiResponse({ status: HttpStatus.OK, type: UpdateCartBody })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: HttpErrorItem })
  @ErrorStatus(CartNotFoundError, HttpStatus.NOT_FOUND)
  @ApiBody({ type: UpdateCartBody })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async patch(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() cart: UpdateCartBody,
  ): Promise<Cart> {
    const userCarts = await this.cartsService.findAllCartsByUser(req.user.userId);
    if (
      userCarts.some((cart) => cart.id === id) ||
      req.user.role === RoleType.admin ||
      req.user.role === RoleType.vendor
    ) {
      return Cart.from(await this.cartsService.updateCart(id, cart));
    } else {
      throw new UnauthorizedException();
    }
  }

  @Delete('/:id')
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: HttpErrorItem })
  @ErrorStatus(CartNotFoundError, HttpStatus.NOT_FOUND)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async delete(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    const userCarts = await this.cartsService.findAllCartsByUser(req.user.userId);
    if (
      userCarts.some((cart) => cart.id === id) ||
      req.user.role === RoleType.admin ||
      req.user.role === RoleType.vendor
    ) {
      await this.cartsService.deleteCart(id);
    } else {
      throw new UnauthorizedException();
    }
  }
}
