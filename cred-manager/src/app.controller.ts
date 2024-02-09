import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    // return this.appService.getHello();
    const prismaUsers = await this.prismaService.user.findMany({
      where: { username: 'sudoFerraz' },
    });
    return JSON.stringify(prismaUsers);
  }
}
