import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Body,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { CurrentUser } from '../auth/decorator/current.user';
import { User } from '../user/entity/user.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { ChatGateway } from './chat.gateway';
import { CheckPasswordDto } from './dto/join-room.dto';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Get('rooms')
  async getRooms() {
    return await this.chatService.getRooms();
  }

  @Get('rooms/:roomId')
  async getRoomInfo(@Param('roomId', ParseIntPipe) roomId: number) {
    return await this.chatService.getRoomInfo(roomId);
  }

  @UseGuards(AuthGuard)
  @Post('rooms')
  async createRoom(
    @Body() createRoomDto: CreateRoomDto,
    @CurrentUser() user: User,
  ) {
    const room = await this.chatService.createRoom(createRoomDto, user);
    this.chatGateway.server.emit('joinRoom', room);
    return room;
  }

  @UseGuards(AuthGuard)
  @Post('rooms/check-password')
  async checkPassword(@Body() checkPasswordDto: CheckPasswordDto) {
    return await this.chatService.checkPassword(checkPasswordDto);
  }

  @UseGuards(AuthGuard)
  @Delete('rooms/:roomId')
  async deleteRoom(@Param('roomId', ParseIntPipe) roomId: number) {
    await this.chatService.deleteRoom(roomId);
    // this.chatGateway.server.emit('roomDeleted', roomId);
    return { message: 'Room deleted successfully' };
  }

  @Get('room/:roomId/messages')
  async getMessagesByRoomId(@Param('roomId', ParseIntPipe) roomId: number) {
    return await this.chatService.getMessagesByRoomId(roomId);
  }

  @Get('room/:roomId/recent')
  async getRecentMessages(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('limit') limit?: number,
  ) {
    return await this.chatService.getRecentMessages(roomId, limit);
  }
}
