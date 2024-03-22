import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';

import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { IToken } from 'src/types/token';
import { ToggleDoneTaskDto } from './dto/toggleDone-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async create(createTaskDto: CreateTaskDto) {
    const decodedToken: IToken = this.jwtService.decode(createTaskDto.token);

    const user = await this.prisma.user.findFirst({
      where: {
        email: decodedToken.email,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.task
      .create({
        data: {
          task: createTaskDto.task,
          authorEmail: decodedToken.email,
        },
      })
      .catch((_) => {
        throw new HttpException(
          'Internal error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
  }

  async toggleIsDone(id: string, updateTaskDto: ToggleDoneTaskDto) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    const decodedToken: IToken = this.jwtService.decode(updateTaskDto.token);

    if (task.authorEmail !== decodedToken.email) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    await this.prisma.task
      .update({
        where: {
          id: parseInt(id),
        },
        data: {
          done: !task.done,
        },
      })
      .catch((_) => {
        throw new HttpException(
          'Internal error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });

    return {...task, done: !task.done};
  }
}
