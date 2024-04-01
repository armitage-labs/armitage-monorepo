import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import fetch from 'node-fetch';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    return JSON.stringify({
      status: 'OK',
    });
  }
}
