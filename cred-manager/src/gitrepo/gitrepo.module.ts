import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { GitRepoService } from './gitrepo.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [],
  providers: [GitRepoService, PrismaService],
  exports: [GitRepoService],
})
export class GitRepoModule {}
