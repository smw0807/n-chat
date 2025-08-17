import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { LeaveRoomDto } from './dto/leave-room.dto';
import { Room } from './interfaces/room.interface';

@Injectable()
export class RoomService {
  private rooms: Map<string, Room> = new Map();

  // 채팅 방 목록
  findAll(): Room[] {
    return Array.from(this.rooms.values());
  }

  // 채팅 방 생성
  create(createRoomDto: CreateRoomDto): Room {
    const room: Room = {
      id: this.generateRoomId(),
      name: createRoomDto.name,
      description: createRoomDto.description,
      maxUsers: createRoomDto.maxUsers || 50,
      isPrivate: createRoomDto.isPrivate || false,
      createdBy: createRoomDto.createdBy,
      createdAt: new Date(),
      users: [createRoomDto.createdBy], // 생성자를 첫 번째 사용자로 추가
    };

    this.rooms.set(room.id, room);
    return room;
  }

  // 채팅 방 참여
  join(roomId: string, joinRoomDto: JoinRoomDto): Room {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.users.includes(joinRoomDto.userId)) {
      throw new Error('User already in room');
    }

    if (room.maxUsers && room.users.length >= room.maxUsers) {
      throw new Error('Room is full');
    }

    room.users.push(joinRoomDto.userId);
    return room;
  }

  // 채팅 방 나가기
  leave(roomId: string, leaveRoomDto: LeaveRoomDto): Room {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    const userIndex = room.users.indexOf(leaveRoomDto.userId);
    if (userIndex === -1) {
      throw new Error('User not in room');
    }

    room.users.splice(userIndex, 1);
    return room;
  }

  // 채팅 방 삭제
  delete(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    this.rooms.delete(roomId);
  }

  // 방 ID 생성
  private generateRoomId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}
