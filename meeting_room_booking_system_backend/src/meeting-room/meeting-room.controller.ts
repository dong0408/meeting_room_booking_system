import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  DefaultValuePipe,
  Query,
  Put,
} from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { generateParseIntPipe } from 'src/utils';

@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

  @Get('list')
  async list(
      @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo')) pageNo: number,
      @Query('pageSize', new DefaultValuePipe(2), generateParseIntPipe('pageSize')) pageSize: number,
      @Query('name') name: string,
      @Query('capacity') capacity: number,
      @Query('equipment') equipment: string
  ) {
      return await this.meetingRoomService.find(pageNo, pageSize, name, capacity, equipment);
  }

  @Put('update')
  async update(@Body() meetingRoomDto: UpdateMeetingRoomDto) {
    return await this.meetingRoomService.update(meetingRoomDto);
  }

  @Get()
  findAll() {
    return this.meetingRoomService.findAll();
  }
  @Post('create')
  async create(@Body() meetingRoomDto: CreateMeetingRoomDto) {
    return await this.meetingRoomService.create(meetingRoomDto);
  }
  @Get(':id')
  async find(@Param('id') id: number) {
    return this.meetingRoomService.findById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.meetingRoomService.delete(id);
  }
}