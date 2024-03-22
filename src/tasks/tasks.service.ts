import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/CreateTask.dto';

import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { IToken } from 'src/types/token';
import { getAccessToken } from 'src/utils/getAccessToken';
import { UpdateTaskDto } from './dto/UpdateTask.dto';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async create(createTaskDto: CreateTaskDto, request: Request) {
    const accessToken = getAccessToken(request);
    const decodedToken: IToken = this.jwtService.decode(accessToken);

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

  async toggleIsDone(id: string, request: Request) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    const accessToken = getAccessToken(request);

    const decodedToken: IToken = this.jwtService.decode(accessToken);

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

  async getAll(request: Request) {
    const accessToken = getAccessToken(request);

    const decodedToken: IToken = this.jwtService.decode(accessToken);

    const tasks = await this.prisma.task.findMany({
      where: {
        authorEmail: decodedToken.email
      }
    });

    return {tasks};
  }

  async delete(id: string, request: Request) {
    const accessToken = getAccessToken(request);

    const decodedToken: IToken = this.jwtService.decode(accessToken);

    const task = await this.prisma.task.findFirst({
      where: {
        id: parseInt(id)
      }
    });

    if (task.authorEmail !== decodedToken.email) {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }

    await this.prisma.task.delete({
      where: {
        id: parseInt(id)
      }
    }).catch(_ => {
      throw new HttpException("Internal error", HttpStatus.INTERNAL_SERVER_ERROR);
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, request: Request) {
    const accessToken = getAccessToken(request);

    const decodedToken: IToken = this.jwtService.decode(accessToken);

    const task = await this.prisma.task.findFirst({
      where: {
        id: parseInt(id)
      }
    });

    if (task.authorEmail !== decodedToken.email) {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }

    await this.prisma.task.update({
      where: {
        id: parseInt(id)
      },
      data: {
        task: updateTaskDto.task
      }
    }).catch(_ => {
      throw new HttpException("Internal error", HttpStatus.INTERNAL_SERVER_ERROR);
    });

    return {...task, task: updateTaskDto.task};
  }
}
