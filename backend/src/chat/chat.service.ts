import { Injectable } from '@nestjs/common';

interface ChatMessage {
  roomId: string;
  userId: string;
  message: string;
  timestamp: Date;
}

@Injectable()
export class ChatService {
  async saveMessage(chatMessage: ChatMessage) {
    // TODO: 데이터베이스에 메시지 저장 로직 구현
    console.log('Saving message:', chatMessage);
    return chatMessage;
  }

  async getMessagesByRoomId(roomId: string) {
    // TODO: 방의 메시지 히스토리 조회 로직 구현
    return [];
  }
}
