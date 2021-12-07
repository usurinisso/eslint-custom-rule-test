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
import { AuthService } from 'auth/auth-service';
import { JwtAuthGuard } from 'auth/jwt-auth-guard';
import { LocalAuthGuard } from 'auth/local-auth-guard';
import { ApiErrorFilter } from 'exception/api-error-filter';
import { ErrorStatus } from 'exception/error-status';
import { UserNotFoundError } from 'exceptions/user-not-found';
import { HttpErrorItem } from 'resources/http-error-item';
import { User } from 'resources/user';
import { UserExtended } from 'resources/user-extended';
import { UserService } from 'services/user';
import { RoleType } from 'types/roleType';
import { CreateUserBody } from 'validators/user/createUserBody';
import { LoginUserBody } from 'validators/user/loginUserBody';
import { UpdateUserBody } from 'validators/user/updateUserBody';

@ApiTags('users')
@Controller('users')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
@UseFilters(new ApiErrorFilter())
export class UsersController {
  constructor(private readonly usersService: UserService, private readonly authService: AuthService) {}

  @Get('/profile')
  @ApiResponse({ status: HttpStatus.OK, type: User })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: HttpErrorItem })
  @ErrorStatus(UserNotFoundError, HttpStatus.NOT_FOUND)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getProfile(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    @Request() req,
  ): Promise<User> {
    return UserExtended.from(await this.usersService.findOneUser(req.user.userId));
  }

  @Get('/:id')
  @ApiResponse({ status: HttpStatus.OK, type: User })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: HttpErrorItem })
  @ErrorStatus(UserNotFoundError, HttpStatus.NOT_FOUND)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getOne(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User> {
    if (req.user.role === RoleType.admin) {
      return UserExtended.from(await this.usersService.findOneUser(id));
    } else {
      throw new UnauthorizedException();
    }
  }

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: [User] })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: HttpErrorItem })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getAll(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    @Request() req,
  ): Promise<User[]> {
    if (req.user.role === RoleType.admin) {
      return (await this.usersService.findAllUsers()).map((user) => User.from(user));
    } else {
      throw new UnauthorizedException();
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginUserBody })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async login(@Request() req): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: User })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: HttpErrorItem })
  async post(@Body() user: CreateUserBody): Promise<User> {
    return User.from(await this.usersService.createUser(user));
  }

  @Patch('/password')
  @ApiResponse({ status: HttpStatus.OK, type: UpdateUserBody })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: HttpErrorItem })
  @ErrorStatus(UserNotFoundError, HttpStatus.NOT_FOUND)
  @ApiBody({ type: UpdateUserBody })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async patch(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    @Request() req,
    @Body() user: UpdateUserBody,
  ): Promise<User> {
    return User.from(await this.usersService.updateUser(req.user.userId, user));
  }

  @Delete('/delete')
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: HttpErrorItem })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: HttpErrorItem })
  @ErrorStatus(UserNotFoundError, HttpStatus.NOT_FOUND)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async delete(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    @Request() req,
  ): Promise<void> {
    await this.usersService.deleteUser(req.user.userId);
  }
}
