import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GithubRepoDto } from './types/githubRepo.dto';

@Injectable()
export class GitRepoService {
  constructor(private readonly prismaService: PrismaService) {}

  async getByTeam(teamId: string): Promise<GithubRepoDto[]> {
    try {
      const foundRepos = await this.prismaService.githubRepo.findMany({
        where: { team_id: teamId },
      });
      return foundRepos;
    } catch (error) {
      console.error('Error fetching user repos', error);
      throw error;
    }
  }
}
