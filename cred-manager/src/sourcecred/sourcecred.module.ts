import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GitRepoModule } from 'src/gitrepo/gitrepo.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { SourceCredController } from './controller/sourcecred.controller';
import { SourceCredService } from './service/sourcecred.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CalculationQueueService } from './service/calculationQueue.service';

@Module({
  imports: [GitRepoModule, ConfigModule.forRoot(), ScheduleModule.forRoot()],
  controllers: [SourceCredController],
  providers: [SourceCredService, PrismaService, CalculationQueueService],
})
export class SourceCredModule { }
