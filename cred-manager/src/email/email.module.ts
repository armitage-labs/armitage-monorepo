import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from './email.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
