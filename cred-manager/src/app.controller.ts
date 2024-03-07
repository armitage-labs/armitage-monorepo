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
    // return this.appService.getHello();
    const prismaUsers = await this.prismaService.user.findMany({
      where: { username: 'sudoFerraz' },
    });
    const response = await fetch(
      `https://api.sendgrid.com/v3/mail/send`,
      {
        method: "POST",
        headers: {
          "Authorization" : `Bearer ${process.env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: `{"personalizations": [{"to": [{"email": "alecerasmus2@gmail.com"}]}],"from": {"email": "info@armitage.xyz"},"subject": "Armitage calculation completed","content": [{"type": "text/plain", "value": "Your Armitage team calculation has been completed. Check in to see your construction scores! :)"}]}`,
      }
    );
    console.log(response);
    return JSON.stringify(prismaUsers);
  }
}
