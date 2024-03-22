import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { TokenTaskDto } from './dto/token-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(AuthGuard)
  @Post("/create")
  create(@Body() createTaskDto: CreateTaskDto, @Req() request: Request) {
    return this.tasksService.create(createTaskDto, request);
  }

  @UseGuards(AuthGuard)
  @Patch("/done/:id")
  done(@Param('id') id: string, @Req() request: Request) {
    return this.tasksService.toggleIsDone(id, request);
  }

  @UseGuards(AuthGuard)
  @Get()
  getAll(@Req() request: Request) {
    return this.tasksService.getAll(request);
  }

  @UseGuards(AuthGuard)
  @Delete("/delete/:id")
  delete(@Param('id') id: string, @Req() request: Request) {
    return this.tasksService.delete(id, request);
  }
}
