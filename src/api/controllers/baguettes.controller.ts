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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'auth/jwt-auth-guard';
import { ApiErrorFilter } from 'exception/api-error-filter';
import { ErrorStatus } from 'exception/error-status';
import { BaguetteNotFoundError } from 'exceptions/baguette-not-found';
import { ShopNotFoundError } from 'exceptions/shop-not-found';
import { Baguette } from 'resources/baguette';
import { HttpErrorItem } from 'resources/http-error-item';
import { BaguetteService } from 'services/baguette';
import { RoleType } from 'types/roleType';
import { CreateBaguetteBody } from 'validators/baguette/createBaguetteBody';
import { UpdateBaguetteBody } from 'validators/baguette/updateBaguetteBody';

@ApiTags('baguettes')
@Controller('shops')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
@UseFilters(new ApiErrorFilter())
export class BaguettesController {
  constructor(private readonly baguettesService: BaguetteService) {}

  @Get('/:shopId/baguettes/:id')
  @ApiResponse({ status: HttpStatus.OK, type: Baguette })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: HttpErrorItem })
  @ErrorStatus(BaguetteNotFoundError, HttpStatus.NOT_FOUND)
  @ErrorStatus(ShopNotFoundError, HttpStatus.NOT_FOUND)
  async getOne(
    @Param('shopId', ParseIntPipe) shopId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Baguette> {
    return Baguette.from(await this.baguettesService.findOneBaguette(shopId, id));
  }

  @Get('/:shopId/baguettes')
  @ApiResponse({ status: HttpStatus.OK, type: [Baguette] })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: HttpErrorItem })
  @ErrorStatus(ShopNotFoundError, HttpStatus.NOT_FOUND)
  async getAll(@Param('shopId', ParseIntPipe) shopId: number): Promise<Baguette[]> {
    return (await this.baguettesService.findAllBaguettes(shopId)).map(Baguette.from);
  }

  @Post('/:shopId/baguettes')
  @ApiResponse({ status: HttpStatus.CREATED, type: Baguette })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: HttpErrorItem })
  @ErrorStatus(ShopNotFoundError, HttpStatus.NOT_FOUND)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async post(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    @Request() req,
    @Param('shopId', ParseIntPipe) shopId: number,
    @Body() baguette: CreateBaguetteBody,
  ): Promise<Baguette> {
    if (req.user.role === RoleType.admin || req.user.role === RoleType.vendor) {
      return Baguette.from(await this.baguettesService.createBaguette(shopId, baguette));
    } else {
      throw new UnauthorizedException();
    }
  }

  @Patch('/:shopId/baguettes/:id')
  @ApiResponse({ status: HttpStatus.OK, type: UpdateBaguetteBody })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: HttpErrorItem })
  @ErrorStatus(BaguetteNotFoundError, HttpStatus.NOT_FOUND)
  @ErrorStatus(ShopNotFoundError, HttpStatus.NOT_FOUND)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async patch(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    @Request() req,
    @Param('shopId', ParseIntPipe) shopId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() baguette: UpdateBaguetteBody,
  ): Promise<Baguette> {
    if (req.user.role === RoleType.admin || req.user.role === RoleType.vendor) {
      return Baguette.from(await this.baguettesService.updateBaguette(shopId, id, baguette));
    } else {
      throw new UnauthorizedException();
    }
  }

  @Delete('/:shopId/baguettes/:id')
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: HttpErrorItem })
  @ErrorStatus(BaguetteNotFoundError, HttpStatus.NOT_FOUND)
  @ErrorStatus(ShopNotFoundError, HttpStatus.NOT_FOUND)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async delete(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    @Request() req,
    @Param('shopId', ParseIntPipe) shopId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    if (req.user.role === RoleType.admin || req.user.role === RoleType.vendor) {
      await this.baguettesService.deleteBaguette(shopId, id);
    } else {
      throw new UnauthorizedException();
    }
  }
}
