import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [PrismaModule, JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
  })]
})
export class TasksModule {}
