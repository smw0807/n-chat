import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { LeaveRoomDto } from './dto/leave-room.dto';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  async findAll() {
    return this.roomService.findAll();
  }

  @Post()
  async create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Post(':id/join')
  async join(@Param('id') id: string, @Body() joinRoomDto: JoinRoomDto) {
    return this.roomService.join(id, joinRoomDto);
  }

  @Post(':id/leave')
  async leave(@Param('id') id: string, @Body() leaveRoomDto: LeaveRoomDto) {
    return this.roomService.leave(id, leaveRoomDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.roomService.delete(id);
  }
}
