import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entity/chat.entity';
import { Room } from '../room/entity/room.entity';
import { User } from '../user/entity/user.entity';

interface ChatMessageDto {
  roomId: number;
  userId: string;
  message: string;
}

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async saveMessage(chatMessageDto: ChatMessageDto): Promise<Chat> {
    const { roomId, userId, message } = chatMessageDto;

    // Room과 User 엔티티 조회
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!room || !user) {
      throw new Error('Room or User not found');
    }

    // 새로운 Chat 엔티티 생성
    const chat = this.chatRepository.create({
      message,
      room,
      user,
    });

    // 데이터베이스에 저장
    return await this.chatRepository.save(chat);
  }

  async getMessagesByRoomId(roomId: number): Promise<Chat[]> {
    return await this.chatRepository.find({
      where: { room: { id: roomId } },
      relations: ['user', 'room'],
      order: { createdAt: 'ASC' },
    });
  }

  async getRecentMessages(roomId: number, limit: number = 50): Promise<Chat[]> {
    return await this.chatRepository.find({
      where: { room: { id: roomId } },
      relations: ['user', 'room'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
