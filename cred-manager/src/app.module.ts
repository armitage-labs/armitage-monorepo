import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { SourceCredModule } from './sourcecred/sourcecred.module';

@Module({
  imports: [ConfigModule.forRoot(), SourceCredModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
