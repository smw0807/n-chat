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
import { Logger } from '@nestjs/common';
import { Room } from './entity/room.entity';

interface ChatMessageDto {
  roomId: number;
  message: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<
    string,
    { userId: string; username: string; roomId?: number }
  >();

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    try {
      this.logger.log(`Client connected: ${client.id}`);

      // 연결 시점에 인증 확인
      const token = this.extractTokenFromHeader(client);
      if (!token) {
        client.emit('error', { message: 'Authentication required' });
        client.disconnect();
        return;
      }
    } catch (error) {
      this.logger.error('Connection error:', error);
      client.emit('error', { message: 'Authentication failed' });
      client.disconnect();
    }
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
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('createRoom')
  handleCreateRoom(
    @MessageBody() room: Room,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // 클라이언트에서 전송된 사용자 정보 사용
      const user = client.handshake.auth.user;
      client.emit('test', user);

      if (!user) {
        client.emit('error', { message: 'User not authenticated' });
        return;
      }

      // Socket.IO 방 생성
      client.join(room.id.toString());

      // 사용자 정보 저장
      this.connectedUsers.set(client.id, {
        userId: user.id,
        username: user.name,
        roomId: room.id,
      });

      // 방 생성 성공 알림
      client.emit('roomCreated', {
        room,
        message: `Room "${room.name}" created successfully`,
      });

      return { success: true, room };
    } catch (error) {
      this.logger.error('Error creating room:', error);
      client.emit('error', {
        message: 'Failed to create room',
        details: error.message,
      });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() room: Room,
    @ConnectedSocket() client: Socket,
  ) {
    // 클라이언트에서 전송된 사용자 정보 사용
    const user = client.handshake.auth.user;

    if (!user) {
      client.emit('error', { message: 'User not authenticated' });
      return;
    }

    // 클라이언트를 방에 참여시킴
    client.join(room.id.toString());

    // 사용자 정보 저장
    this.connectedUsers.set(client.id, {
      userId: user.id,
      username: user.name,
      roomId: room.id,
    });

    // 방의 다른 사용자들에게 새 사용자 입장 알림
    client.to(room.id.toString()).emit('userJoined', {
      userId: user.id,
      username: user.name,
      timestamp: new Date(),
    });

    // 방의 최근 메시지 히스토리 전송
    try {
      const recentMessages = await this.chatService.getRecentMessages(
        room.id,
        20,
      );
      client.emit('messageHistory', recentMessages.reverse());
    } catch (error) {
      this.logger.error('Error fetching message history:', error);
    }

    return { success: true, message: `Joined room: ${room.id}` };
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() leaveRoomDto: { roomId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = leaveRoomDto;

    const user = client.handshake.auth.user;

    if (!user) {
      client.emit('error', { message: 'User not authenticated' });
      return;
    }

    // 클라이언트를 방에서 나가게 함
    client.leave(roomId.toString());

    // 사용자 정보에서 방 정보 제거
    const userInfo = this.connectedUsers.get(client.id);
    if (userInfo) {
      userInfo.roomId = undefined;
    }

    // 방의 다른 사용자들에게 사용자 퇴장 알림
    client.to(roomId.toString()).emit('userLeft', {
      userId: user.id,
      username: user.name,
      timestamp: new Date(),
    });

    return { success: true, message: `Left room: ${roomId}` };
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() chatMessageDto: ChatMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, message } = chatMessageDto;

    const user = client.handshake.auth.user;

    if (!user) {
      client.emit('error', { message: 'User not authenticated' });
      return;
    }

    try {
      // 메시지를 데이터베이스에 저장
      const savedChat = await this.chatService.saveMessage({
        roomId,
        userId: user.id,
        message,
      });

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
      this.logger.error('Error saving message:', error);
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
      isTyping: boolean;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, isTyping } = typingData;

    const user = client.handshake.auth.user;

    if (!user) {
      return;
    }

    // 방의 다른 사용자들에게 타이핑 상태 전송
    client.to(roomId.toString()).emit('userTyping', {
      userId: user.id,
      username: user.name,
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
      const messages = await this.chatService.getRecentMessages(roomId, limit);
      client.emit('messageHistory', messages);
    } catch (error) {
      this.logger.error('Error fetching message history:', error);
      client.emit('messageError', {
        error: 'Failed to fetch message history',
        details: error.message,
      });
    }
  }

  private extractTokenFromHeader(client: Socket): string | undefined {
    const auth =
      client.handshake.auth.token || client.handshake.headers.authorization;

    if (!auth) {
      return undefined;
    }

    if (auth.startsWith('Bearer ')) {
      return auth.substring(7);
    }

    return auth;
  }
}
