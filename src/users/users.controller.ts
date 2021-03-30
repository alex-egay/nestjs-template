import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  UseInterceptors,
  Param,
} from '@nestjs/common';

import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { ResponseSuccess, ResponseError } from '../common/dto/response.dto';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { ProfileDto } from './dto/profile.dto';

import { IResponse } from '../common/interfaces/i-response';
import { User } from './interfaces/user.interface';

const success: string = 'COMMON.SUCCESS';
const err: string = 'COMMON.ERROR.GENERIC_ERROR';

@Controller('users')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Get('user')
  public async findAll(@Param() params: any): Promise<ResponseSuccess | ResponseError> {
    try {
      const users: User[] = await this.usersService.findAll();

      return new ResponseSuccess(success, users);
    } catch (error) {
      return new ResponseError(err, error);
    }
  }

  @Get('user/email/:email')
  public async findByEmail(@Param() params: any): Promise<IResponse> {
    try {
      const user: User = await this.usersService.findByEmail(params.email);

      return new ResponseSuccess(success, new UserDto(user));
    } catch (error) {
      return new ResponseError(err, error);
    }
  }

  @Delete('user/email/:email')
  public async deleteByEmail(@Param() params: any): Promise<IResponse> {
    try {
      const user: User = await this.usersService.deleteByEmail(params.email);

      return new ResponseSuccess(success, new UserDto(user));
    } catch (error) {
      return new ResponseError(err, error);
    }
  }

  @Get('user/email/:email/friends')
  public async findByEmailFriends(@Param() params: any): Promise<IResponse> {
    try {
      const users: User[] = await this.usersService.findByEmailFriends(params.email);

      return new ResponseSuccess(success, users);
    } catch (error) {
      return new ResponseError(err, error);
    }
  }

  @Get('user/email/:email/friends/incHobby/:hobby')
  public async findByEmailFriendsIncHobby(@Param() params: any): Promise<IResponse> {
    try {
      const users: User[] = await this.usersService.findByEmailFriendsIncHobby(params.email, params.hobby);

      return new ResponseSuccess(success, users);
    } catch (error) {
      return new ResponseError(err, error);
    }
  }

  @Get('user/email/:email/friends/incHobbies/:hobbies/incTown/:town')
  public async findByEmailFriendsIncHobbiesTown(@Param() params: any): Promise<IResponse> {
    try {
      const users: User[] = await this.usersService.findByEmailFriendsIncHobbiesTown(
        params.email,
        params.hobbies,
        params.town,
      );

      return new ResponseSuccess(success, users);
    } catch (error) {
      return new ResponseError(err, error);
    }
  }

  @Get('hobbies/incTown/:town')
  public async HobbiesIncTown(@Param() params: any): Promise<ResponseSuccess | ResponseError> {
    try {
      const hobbies: string[] = await this.usersService.HobbiesIncTown(
        params.town,
      );

      return new ResponseSuccess(success, hobbies);
    } catch (error) {
      return new ResponseError(err, error);
    }
  }

  @Get('town/incHobbies/:hobby')
  public async townIncHobbies(@Param() params: any): Promise<ResponseSuccess | ResponseError> {
    try {
      const hobbies: string[] = await this.usersService.townIncHobbies(
        params.hobby,
      );

      return new ResponseSuccess(success, hobbies);
    } catch (error) {
      return new ResponseError(err, error);
    }
  }

  @Post('profile/update')
  public async updateProfile(@Body() profileDto: ProfileDto): Promise<IResponse> {
    try {
      const user: User = await this.usersService.updateProfile(profileDto);

      return new ResponseSuccess('PROFILE.UPDATE_SUCCESS', new UserDto(user));
    } catch (error) {
      return new ResponseError('PROFILE.UPDATE_ERROR', error);
    }
  }

  @Post('profile/update/friend/:email')
  public async updateFriend(@Param() params: any, @Body() friends: string[]): Promise<IResponse> {
    try {
      const user: User = await this.usersService.updateFriend(friends, params.email);

      return new ResponseSuccess('PROFILE.UPDATE_SUCCESS', new UserDto(user));
    } catch (error) {
      return new ResponseError('PROFILE.UPDATE_ERROR', error);
    }
  }

}
