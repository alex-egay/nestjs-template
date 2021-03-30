import {
  Module,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchema } from './schemas/user.schema';
import { logger } from '../common/middlewares/logger.middleware';

@Module({
  controllers: [UsersController],
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [UsersService],
})
export class UsersModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(logger)
      .forRoutes(UsersController);
  }
}
