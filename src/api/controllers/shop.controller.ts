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
import { ShopNotFoundError } from 'exceptions/shop-not-found';
import { HttpErrorItem } from 'resources/http-error-item';
import { Shop } from 'resources/shop';
import { ShopService } from 'services/shop';
import { RoleType } from 'types/roleType';
import { CreateShopBody } from 'validators/shop/createShopBody';
import { UpdateShopBody } from 'validators/shop/updateShopBody';

@ApiTags('shops')
@Controller('shops')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
@UseFilters(new ApiErrorFilter())
export class ShopController {
  constructor(private readonly shopsService: ShopService) {}

  @Get('/:id')
  @ApiResponse({ status: HttpStatus.OK, type: Shop })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: HttpErrorItem })
  @ErrorStatus(ShopNotFoundError, HttpStatus.NOT_FOUND)
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<Shop> {
    return Shop.from(await this.shopsService.findOneShop(id));
  }

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: [Shop] })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: HttpErrorItem })
  async getAll(): Promise<Shop[]> {
    return (await this.shopsService.findAllShops()).map((shop) => Shop.from(shop));
  }

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: Shop })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: HttpErrorItem })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async post(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    @Request() req,
    @Body() shop: CreateShopBody,
  ): Promise<Shop> {
    if (req.user.role === RoleType.admin) {
      return Shop.from(await this.shopsService.createShop(shop));
    } else {
      throw new UnauthorizedException();
    }
  }

  @Patch('/:id')
  @ApiResponse({ status: HttpStatus.OK, type: UpdateShopBody })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: HttpErrorItem })
  @ErrorStatus(ShopNotFoundError, HttpStatus.NOT_FOUND)
  @ApiBody({ type: UpdateShopBody })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async patch(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() shop: UpdateShopBody,
  ): Promise<Shop> {
    if (req.user.role === RoleType.admin || req.user.role === RoleType.vendor) {
      return Shop.from(await this.shopsService.updateShop(id, shop));
    } else {
      throw new UnauthorizedException();
    }
  }

  @Delete('/:id')
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: HttpErrorItem })
  @ErrorStatus(ShopNotFoundError, HttpStatus.NOT_FOUND)
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
      await this.shopsService.deleteShop(id);
    } else {
      throw new UnauthorizedException();
    }
  }
}
