import {
  Controller,
  Post,
  HttpStatus,
  HttpCode,
  Body,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { Login } from './interfaces/login.interface';
import { ResponseSuccess, ResponseError } from '../common/dto/response.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { IResponse } from '../common/interfaces/i-response';
import { ConsentRegistry } from './interfaces/consentregistry.interface';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UsersService ) {}

  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() login: Login): Promise<IResponse> {
    try {
      const response:{ user: UserDto } = await this.authService.validateLogin(login.email, login.password);

      return new ResponseSuccess("LOGIN.SUCCESS", response);
    } catch(error) {
      return new ResponseError("LOGIN.ERROR", error);
    }
  }

  @Post('email/register')
  @HttpCode(HttpStatus.OK)
  public async register(@Body() createUserDto: CreateUserDto): Promise<IResponse> {
    try {
      const newUser:any = new UserDto(await this.userService.createNewUser(createUserDto));
      const user:ConsentRegistry = await this.authService.saveUserConsent(newUser.email);
      if(user){
        return new ResponseSuccess("REGISTRATION.USER_REGISTERED_SUCCESSFULLY");
      } else {
        return new ResponseError("REGISTRATION.ERROR.MAIL_NOT_SENT");
      }
    } catch(error){
      return new ResponseError("REGISTRATION.ERROR.GENERIC_ERROR", error);
    }
  }


}
