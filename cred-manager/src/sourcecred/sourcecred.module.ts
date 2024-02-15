import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GitRepoModule } from 'src/gitrepo/gitrepo.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { SourceCredController } from './controller/sourcecred.controller';
import { SourceCredService } from './service/sourcecred.service';

@Module({
  imports: [GitRepoModule, ConfigModule.forRoot()],
  controllers: [SourceCredController],
  providers: [SourceCredService, PrismaService],
})
export class SourceCredModule {}
