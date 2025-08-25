import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entity/chat.entity';
import { Room } from './entity/room.entity';
import { User } from '../user/entity/user.entity';
import { CreateRoomDto } from './dto/create-room.dto';

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

  // 채팅 방 목록
  async getRooms(): Promise<Room[]> {
    return await this.roomRepository.find({
      relations: ['user'],
      select: {
        id: true,
        name: true,
        description: true,
        isPrivate: true,
        maxUsers: true,
        createdAt: true,
        user: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
        },
      },
    });
  }

  async getRoomInfo(roomId: number): Promise<Room | null> {
    return await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['user'],
      select: {
        id: true,
        name: true,
        description: true,
        isPrivate: true,
        maxUsers: true,
        createdAt: true,
        user: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
        },
      },
    });
  }

  // 방 생성
  async createRoom(createRoomDto: CreateRoomDto, user: User): Promise<Room> {
    const { name, description, maxUsers, isPrivate, password } = createRoomDto;

    // 새로운 방 생성
    const room = this.roomRepository.create({
      name,
      description,
      maxUsers: maxUsers || 50,
      isPrivate: isPrivate || false,
      password: password || null, // null 허용
      user, // 방 생성자
    });

    const savedRoom = await this.roomRepository.save(room);

    // 생성된 방 정보 반환 (Socket.IO에서 사용할 수 있도록)
    const createdRoom = await this.roomRepository.findOne({
      where: { id: savedRoom.id },
      relations: ['user'],
      select: {
        id: true,
        name: true,
        description: true,
        isPrivate: true,
        maxUsers: true,
        createdAt: true,
        user: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
        },
      },
    });

    if (!createdRoom) {
      throw new Error('Failed to create room');
    }

    return createdRoom;
  }

  async deleteRoom(roomId: number): Promise<void> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new Error('Room not found');
    }
    await this.roomRepository.delete(roomId);
  }

  // 메시지 저장
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

  // 방의 메시지 목록
  async getMessagesByRoomId(roomId: number): Promise<Chat[]> {
    return await this.chatRepository.find({
      where: { room: { id: roomId } },
      relations: ['user', 'room'],
      order: { createdAt: 'ASC' },
    });
  }

  // 방의 최근 메시지 목록
  async getRecentMessages(roomId: number, limit: number = 50): Promise<Chat[]> {
    return await this.chatRepository.find({
      where: { room: { id: roomId } },
      relations: ['user', 'room'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
