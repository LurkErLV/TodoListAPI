import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/LoginUser.dto';
import { RefreshToken } from './dto/RefreshToken.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}
  
  @HttpCode(HttpStatus.OK)
  async signUp(createUserDto: CreateUserDto) {
    const foundUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: { contains: createUserDto.email },
          },
          {
            login: { contains: createUserDto.login },
          }
        ]
      }
    });

    if (foundUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const payload = { email: createUserDto.email };

    const tokens = {
      access_token: await this.jwtService.signAsync(payload, {expiresIn: "60s"}),
      refreshToken: await this.jwtService.signAsync(payload, {expiresIn: "24h", secret: process.env.JWT_REFRESH_SECRET})
    }

    await this.prisma.user.create({
      data: {
        login: createUserDto.login,
        email: createUserDto.email,
        password: await bcrypt.hash(createUserDto.password, 10),
        refreshToken: tokens.refreshToken
      }
    });

    return tokens;
  }

  @HttpCode(HttpStatus.OK)
  async login(loginUserDto: LoginUserDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: loginUserDto.email
      }
    });

    if (!user) {
      throw new HttpException("User not exists", HttpStatus.NOT_FOUND);
    }

    if (!bcrypt.compareSync(loginUserDto.password, user.password)) {
      throw new HttpException("Incorrect password", HttpStatus.UNAUTHORIZED);
    }

    const payload = { email: loginUserDto.email };

    const tokens = {
      access_token: await this.jwtService.signAsync(payload, {expiresIn: "60s"}),
      refreshToken: await this.jwtService.signAsync(payload, {expiresIn: "24h", secret: process.env.JWT_REFRESH_SECRET})
    }

    await this.prisma.user.update({
      where: {
        email: loginUserDto.email
      },
      data: {
        refreshToken: tokens.refreshToken
      }
    });

    return tokens;
  }

  @HttpCode(HttpStatus.OK)
  async refresh(refreshToken: RefreshToken) {
    if (!this.jwtService.verify(refreshToken.token, {secret: process.env.JWT_REFRESH_SECRET})) {
      throw new HttpException("Token is not valid", HttpStatus.UNAUTHORIZED);
    }

    const decoded = this.jwtService.decode(refreshToken.token);

    const user = await this.prisma.user.findFirst({
      where: {
        email: decoded.email
      }
    });

    if (!user) {
     throw new HttpException("User not exists", HttpStatus.NOT_FOUND);
    }

    if (user.refreshToken !== refreshToken.token) {
      throw new HttpException("Refresh token is not valid", HttpStatus.UNAUTHORIZED);
    }

    const payload = { email: decoded.email };

    const tokens = {
      access_token: await this.jwtService.signAsync(payload, {expiresIn: "60s"}),
      refreshToken: await this.jwtService.signAsync(payload, {expiresIn: "24h", secret: process.env.JWT_REFRESH_SECRET})
    }

    await this.prisma.user.update({
      where: {
        email: decoded.email
      },
      data: {
        refreshToken: tokens.refreshToken
      }
    });

    return tokens;
  }
}
