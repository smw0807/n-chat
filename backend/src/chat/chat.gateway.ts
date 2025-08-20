import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

interface ChatMessageDto {
  roomId: number;
  userId: string;
  message: string;
}

interface JoinRoomDto {
  roomId: number;
  userId: string;
  username: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<
    string,
    { userId: string; username: string; roomId?: number }
  >();

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const userInfo = this.connectedUsers.get(client.id);
    if (userInfo) {
      // 사용자가 연결을 끊을 때 방에서 나가기 처리
      if (userInfo.roomId) {
        this.server.to(userInfo.roomId.toString()).emit('userLeft', {
          userId: userInfo.userId,
          username: userInfo.username,
          timestamp: new Date(),
        });
      }
      this.connectedUsers.delete(client.id);
    }
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() joinRoomDto: JoinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, userId, username } = joinRoomDto;

    // 클라이언트를 방에 참여시킴
    client.join(roomId.toString());

    // 사용자 정보 저장
    this.connectedUsers.set(client.id, { userId, username, roomId });

    // 방의 다른 사용자들에게 새 사용자 입장 알림
    client.to(roomId.toString()).emit('userJoined', {
      userId,
      username,
      timestamp: new Date(),
    });

    // 방의 최근 메시지 히스토리 전송
    try {
      const recentMessages = await this.chatService.getRecentMessages(
        roomId,
        20,
      );
      client.emit('messageHistory', recentMessages.reverse());
    } catch (error) {
      console.error('Error fetching message history:', error);
    }

    return { success: true, message: `Joined room: ${roomId}` };
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody()
    leaveRoomDto: { roomId: number; userId: string; username: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, userId, username } = leaveRoomDto;

    // 클라이언트를 방에서 나가게 함
    client.leave(roomId.toString());

    // 사용자 정보에서 방 정보 제거
    const userInfo = this.connectedUsers.get(client.id);
    if (userInfo) {
      userInfo.roomId = undefined;
    }

    // 방의 다른 사용자들에게 사용자 퇴장 알림
    client.to(roomId.toString()).emit('userLeft', {
      userId,
      username,
      timestamp: new Date(),
    });

    return { success: true, message: `Left room: ${roomId}` };
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() chatMessageDto: ChatMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, userId, message } = chatMessageDto;

    try {
      // 메시지를 데이터베이스에 저장
      const savedChat = await this.chatService.saveMessage(chatMessageDto);

      // 방의 모든 사용자에게 메시지 전송
      this.server.to(roomId.toString()).emit('newMessage', {
        id: savedChat.id,
        userId: savedChat.user.id,
        username: savedChat.user.name,
        message: savedChat.message,
        timestamp: savedChat.createdAt,
      });

      return { success: true, messageId: savedChat.id };
    } catch (error) {
      console.error('Error saving message:', error);
      client.emit('messageError', {
        error: 'Failed to save message',
        details: error.message,
      });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody()
    typingData: {
      roomId: number;
      userId: string;
      username: string;
      isTyping: boolean;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, userId, username, isTyping } = typingData;

    // 방의 다른 사용자들에게 타이핑 상태 전송
    client.to(roomId.toString()).emit('userTyping', {
      userId,
      username,
      isTyping,
    });
  }

  @SubscribeMessage('getMessageHistory')
  async handleGetMessageHistory(
    @MessageBody() data: { roomId: number; limit?: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, limit = 50 } = data;

    try {
      const messages = await this.chatService.getMessagesByRoomId(roomId);
      client.emit('messageHistory', messages);
    } catch (error) {
      console.error('Error fetching message history:', error);
      client.emit('messageError', {
        error: 'Failed to fetch message history',
        details: error.message,
      });
    }
  }
}
