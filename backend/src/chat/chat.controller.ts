import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

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
