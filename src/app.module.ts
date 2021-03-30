import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from "./auth/auth.module";
import { MongooseModule } from '@nestjs/mongoose';
import {default as config} from "./config";

const userString:string = config.db.user && config.db.pass ? (config.db.user + ':' + config.db.pass + '@') : '';
const authSource:string = config.db.authSource ? ('?authSource='+config.db.authSource + '&w=1') : '' ;

@Module({
  controllers: [AppController],
  imports: [
    MongooseModule.forRoot(
      `mongodb://${userString}${ config.db.host}:${config.db.port || '27017'}/${config.db.database}${authSource}`),
    UsersModule,
    AuthModule],
  providers: [AppService],
})
export class AppModule {}
