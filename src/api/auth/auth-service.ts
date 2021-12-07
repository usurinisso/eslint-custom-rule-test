import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserWithCartAndOrders } from 'models/users';
import { UserService } from 'services/user';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService, private jwtService: JwtService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByName(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserWithCartAndOrders) {
    const payload = {
      username: user.userName,
      sub: user.id,
      role: user.role,
      cart: user.cart,
      orders: user.orders,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
