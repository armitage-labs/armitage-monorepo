import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GithubRepoDto } from './types/githuRepo.dto';

@Injectable()
export class GitRepoService {
  constructor(private readonly prismaService: PrismaService) {}

  async getByUser(userId: string): Promise<GithubRepoDto[]> {
    try {
      const foundRepos = await this.prismaService.githubRepo.findMany({
        where: { user_id: userId },
      });
      return foundRepos;
    } catch (error) {
      console.error('Error fetching user repos', error);
      throw error;
    }
  }
}
