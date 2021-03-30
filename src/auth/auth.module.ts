import {
  Module,
  MiddlewareConsumer,
  NestModule,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserSchema } from '../users/schemas/user.schema';
import { ConsentRegistrySchema } from './schemas/consentregistry.schema';
import { UsersService } from '../users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { logger } from '../common/middlewares/logger.middleware';

@Module({
  controllers: [AuthController],
  imports: [MongooseModule.forFeature([
    { name: 'User', schema: UserSchema },
    { name: 'ConsentRegistry', schema: ConsentRegistrySchema },
  ])],
  providers: [AuthService, UsersService],
})
export class AuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
     consumer
      .apply(logger)
      .forRoutes(AuthController);
   }
}
