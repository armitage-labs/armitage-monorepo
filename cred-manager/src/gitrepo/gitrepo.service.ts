import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GitRepoService {
  constructor(private readonly prismaService: PrismaService) {}

  craftPluginConfigString(githubRepos: string[]): string {
    return '';
  }
}
