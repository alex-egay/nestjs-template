import { Model, Schema } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import {
  Injectable,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { ProfileDto } from './dto/profile.dto';

const saltRounds: number = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>) {
  }


  public async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  public async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email: email }).exec();
  }

  public async deleteByEmail(email: string): Promise<User> {
    return this.userModel.remove({ email: email }).exec();
  }

  public async findByEmailFriends(email: string): Promise<User[]> {
    const candidate: User = this.userModel.findOne({ email: email }).exec();
    const friends: User[] = [];

    if (candidate.friends.length > 0) {
      await candidate.friends.map((value: { _id: string }) => {
        const friend: User = this.userModel.findOne({ _id: value._id }).exec();
        friends.push(friend);
      });
    }

    return friends;
  }

  public async findByEmailFriendsIncHobby(email: string, hobby: string): Promise<User[]> {
    const candidate: User = this.userModel.findOne({ email: email }).exec();
    const friends: User[] = [];

    if (candidate.friends.length > 0) {
      await candidate.friends.forEach((value: { _id: string }) => {
        const friend: User = this.userModel.findOne({ _id: value._id }).exec();
        const hobbies: string[] = friend.hobby;
        if (hobby.length > 0 && hobbies.includes(hobby)) {
          friends.push(friend);
        }

        return;
      });
    }

    return friends;
  }

  public async findByEmailFriendsIncHobbiesTown(email: string, hobbies: string, town: string): Promise<User[]> {
    const candidate: User = this.userModel.findOne({ email: email }).exec();
    const friends: User[] = [];

    if (candidate.friends.length > 0) {
      await candidate.friends.forEach((value: { _id: string }) => {
        const friend: User = this.userModel.findOne({ _id: value._id }).exec();
        const hobby: string[] = friend.hobby;
        const towns: string[] = friend.towns;
        if (hobby.length > 0 && towns.length > 0 && hobby.includes(hobbies) && towns.includes(town)) {
          friends.push(friend);
        }

        return;
      });
    }

    return friends;
  }

  public async HobbiesIncTown(town: string): Promise<string[]> {
    const candidate: User[] = this.userModel.find({ towns: { $all: [town] } }).exec();
    const hobbies: string[] = [];
    if (candidate.length > 0) {
      await candidate.forEach((value: User) => {
        if (value.hobby.length > 0) {
          value.hobby.forEach((item: string) => {
            if (!hobbies.includes(item)) {
              hobbies.push(item);
            }
          });
        }
      });
    }

    return hobbies;
  }

  public async townIncHobbies(hobby: string): Promise<string[]> {
    const candidate: User[] = this.userModel.find(
      {
        hobby: {
          $all:
            [hobby],
        },
      }).exec();
    const towns: string[] = [];
    if (candidate.length > 0) {
      await candidate.forEach((value: User) => {
        if (value.towns.length > 0) {
          value.towns.forEach((item: string) => {
            if (!towns.includes(item)) {
              towns.push(item);
            }
          });
        }
      });
    }

    return towns;
  }

  public async createNewUser(newUser: CreateUserDto): Promise<User> {
    if (this.isValidEmail(newUser.email) && newUser.password) {
      const userRegistered: User = await this.findByEmail(newUser.email);
      if (!userRegistered) {
        const features: object[] = [];
        newUser.password = await bcrypt.hash(newUser.password, saltRounds);
        if (newUser.hobby.length > 0) {
          await newUser.hobby.forEach((item: string) => {
            switch (item) {
              case 'guitar':
                return features.push({ concerts: 'Moscow' });
              case 'skiing':
                return features.push({ resorts: 'Spa' });
              case 'stamp':
                return features.push({ stamps: 'new stamp' });
              default:
                return null;
            }
          });
        }

        newUser.features = features;

        const createdUser: Schema = new this.userModel(newUser);

        return createdUser.save();

      } else if (!userRegistered.email) {
        return userRegistered;
      } else {
        throw new HttpException('REGISTRATION.USER_ALREADY_REGISTERED', HttpStatus.FORBIDDEN);
      }
    } else {
      throw new HttpException('REGISTRATION.MISSING_MANDATORY_PARAMETERS', HttpStatus.FORBIDDEN);
    }

  }

  public isValidEmail(email: string): boolean {
    if (email) {

      // tslint:disable-next-line:max-line-length
      const re: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      return re.test(email);
    } else {
      return false;
    }
  }

  public async updateProfile(profileDto: ProfileDto): Promise<User> {
    const userFromDb: Schema = await this.userModel.findOne({ email: profileDto.email });
    if (!userFromDb) {
      throw new HttpException('COMMON.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (profileDto.name) {
      userFromDb.name = profileDto.name;
    }
    if (profileDto.surname) {
      userFromDb.surname = profileDto.surname;
    }
    if (profileDto.phone) {
      userFromDb.phone = profileDto.phone;
    }
    if (profileDto.birthDayDate) {
      userFromDb.birthdaydate = profileDto.birthDayDate;
    }

    await userFromDb.save();

    return userFromDb;
  }

  public async updateFriend(friends: string[], email: string): Promise<User> {
    const userFromDb: Schema = await this.userModel.findOne({ email: email });
    if (!userFromDb) {
      throw new HttpException('COMMON.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    if (friends) {
      userFromDb.friends = friends;
    }

    await userFromDb.save();

    return userFromDb;
  }

}
