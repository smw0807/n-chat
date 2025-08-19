import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ChatModule } from './chat/chat.module';
import { RoomModule } from './room/room.module';
import { PostgresModule } from './postgres/postgres.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigModule, ChatModule, RoomModule, PostgresModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
