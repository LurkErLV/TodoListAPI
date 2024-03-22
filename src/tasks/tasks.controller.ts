import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ToggleDoneTaskDto } from './dto/toggleDone-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(AuthGuard)
  @Post("/create")
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @UseGuards(AuthGuard)
  @Patch("/done/:id")
  done(@Param('id') id: string, @Body() updateTaskDto: ToggleDoneTaskDto) {
    return this.tasksService.toggleIsDone(id, updateTaskDto);
  }
}
