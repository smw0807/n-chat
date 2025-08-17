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

interface ChatMessage {
  roomId: string;
  userId: string;
  message: string;
  timestamp: Date;
}

interface JoinRoomDto {
  roomId: string;
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
    { userId: string; username: string; roomId?: string }
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
        this.server.to(userInfo.roomId).emit('userLeft', {
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
  handleJoinRoom(
    @MessageBody() joinRoomDto: JoinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, userId, username } = joinRoomDto;

    // 클라이언트를 방에 참여시킴
    client.join(roomId);

    // 사용자 정보 저장
    this.connectedUsers.set(client.id, { userId, username, roomId });

    // 방의 다른 사용자들에게 새 사용자 입장 알림
    client.to(roomId).emit('userJoined', {
      userId,
      username,
      timestamp: new Date(),
    });

    return { success: true, message: `Joined room: ${roomId}` };
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody()
    leaveRoomDto: { roomId: string; userId: string; username: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, userId, username } = leaveRoomDto;

    // 클라이언트를 방에서 나가게 함
    client.leave(roomId);

    // 사용자 정보에서 방 정보 제거
    const userInfo = this.connectedUsers.get(client.id);
    if (userInfo) {
      userInfo.roomId = undefined;
    }

    // 방의 다른 사용자들에게 사용자 퇴장 알림
    client.to(roomId).emit('userLeft', {
      userId,
      username,
      timestamp: new Date(),
    });

    return { success: true, message: `Left room: ${roomId}` };
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() chatMessage: ChatMessage,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, userId, message, timestamp } = chatMessage;

    // 방의 모든 사용자에게 메시지 전송
    this.server.to(roomId).emit('newMessage', {
      userId,
      message,
      timestamp,
    });

    // 메시지를 데이터베이스에 저장 (ChatService에서 처리)
    this.chatService.saveMessage(chatMessage);

    return { success: true };
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody()
    typingData: {
      roomId: string;
      userId: string;
      username: string;
      isTyping: boolean;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, userId, username, isTyping } = typingData;

    // 방의 다른 사용자들에게 타이핑 상태 전송
    client.to(roomId).emit('userTyping', {
      userId,
      username,
      isTyping,
    });
  }
}
