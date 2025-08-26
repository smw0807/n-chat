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
    origin: [
      'http://localhost:3001',
      'http://localhost:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3000',
    ],
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);
  private readonly namespace = '/chat';

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

      // 연결 시점에 인증 확인 (개발 환경에서는 임시로 허용)
      const token = this.extractTokenFromHeader(client);
      const user = client.handshake.auth.user;

      if (!token && !user) {
        this.logger.warn(
          'No authentication provided, but allowing connection for development',
        );
        // 개발 환경에서는 임시로 연결 허용
        return;
      }

      this.logger.log(`User authenticated: ${user?.name || 'Unknown'}`);
    } catch (error) {
      this.logger.error('Connection error:', error);
      // 개발 환경에서는 연결 유지
      this.logger.warn(
        'Connection error occurred, but maintaining connection for development',
      );
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

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() room: Room,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('#### joinRoom ####', client.id);
    // 클라이언트에서 전송된 사용자 정보 사용
    const user = client.handshake.auth.user;

    if (!user) {
      client.emit('error', { message: 'User not authenticated' });
      return;
    }

    const roomInfo = await this.chatService.getRoomInfo(room.id);
    if (!roomInfo) {
      client.emit('error', { message: '채팅방을 찾을 수 없습니다.' });
      return;
    }
    const maxUsers = roomInfo.maxUsers;

    // 방 인원 체크
    const roomSockets = await this.server.in(room.id.toString()).fetchSockets();
    const currentUsers = roomSockets.length;

    if (currentUsers >= maxUsers) {
      client.emit('error', { message: '채팅방 인원이 가득 찼습니다.' });
      return;
    }

    // 클라이언트를 방에 참여시킴
    client.join(room.id.toString());

    // 사용자 정보 저장 (client.id를 키로 사용)
    this.connectedUsers.set(client.id, {
      ...user,
      roomId: room.id,
    });

    // 방의 다른 사용자들에게 새 사용자 입장 알림
    this.server
      .to(room.id.toString())
      .emit('userJoined', this.connectedUsers.get(client.id));

    // 방에 있는 모든 사용자 목록을 새로 참여한 사용자에게 전송
    const roomUserIds = Array.from(this.connectedUsers.values()).filter(
      (user) => user.roomId === room.id,
    );
    client.emit('roomUsers', roomUserIds);

    // 방의 최근 메시지 히스토리 전송 (방에 참여한 사용자에게만)
    try {
      const recentMessages = await this.chatService.getRecentMessages(
        room.id,
        20,
      );
      client.emit('messageHistory', recentMessages);
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
    client.to(roomId.toString()).emit('userLeft', user);

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
      console.log(savedChat);

      // 방의 모든 사용자에게 메시지 전송 (자신 포함)
      this.server.to(roomId.toString()).emit('newMessage', {
        id: savedChat.id,
        message: savedChat.message,
        timestamp: savedChat.createdAt,
        user,
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
