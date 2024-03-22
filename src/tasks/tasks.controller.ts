import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/CreateTask.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateTaskDto } from './dto/UpdateTask.dto';

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

  @UseGuards(AuthGuard)
  @Patch("/update/:id")
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Req() request: Request) {
    return this.tasksService.update(id, updateTaskDto, request);
  }
}
