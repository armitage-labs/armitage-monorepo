import { Injectable } from '@nestjs/common';
import {
  CredGrainView,
  ParticipantCredGrain,
  sourcecred as sc,
} from 'sourcecred';
import { PrismaService } from 'src/prisma/prisma.service';
import { GitRepoService } from 'src/gitrepo/gitrepo.service';
import { UserCredDto } from '../types/userCredDto';
import { ContributionRepoDto } from '../types/contributionRepo.dto';
import { UserScoreRepoDto } from '../types/userScoreRepo.dto';
import { executeCommand } from '../utils/bashCommand';

@Injectable()
export class SourceCredService {
  constructor(
    private readonly gitRepoService: GitRepoService,
    private readonly prismaService: PrismaService
  ) { }

  async calculateCredScores(userId: string): Promise<UserCredDto[]> {
    const userRegisteredRepos = await this.gitRepoService.getByUser(userId);
    const pluginConfigString = this.craftPluginConfigString(
      userRegisteredRepos.map((repo) => repo.full_name),
    );
    const contribution = await this.saveContribution(userId);
    await this.configureSourcecredGithubPlugin(pluginConfigString);
    await this.loadSourceCredPlugins();
    const userCredDtoArray = await this.loadLocalScInstance();
    await this.saveUserScore(contribution.id, userCredDtoArray)

    return userCredDtoArray;
  }

  craftPluginConfigString(githubReposFullNames: string[]): string {
    let pluginConfigurationString = '';
    for (const gitRepoFullName of githubReposFullNames) {
      if (pluginConfigurationString.length > 0) {
        const gitRepoEntry = `, \"${gitRepoFullName}\"`;
        pluginConfigurationString = pluginConfigurationString + gitRepoEntry;
      } else {
        const gitRepoEntry = `\"${gitRepoFullName}\"`;
        pluginConfigurationString = pluginConfigurationString + gitRepoEntry;
      }
    }
    return pluginConfigurationString;
  }

  async configureSourcecredGithubPlugin(pluginConfigurationString: string) {
    try {
      await executeCommand(
        `echo \'{\"repositories\": [${pluginConfigurationString}]}\' > /Users/sudoferraz/Personal/source-cred/source-cred-instance/config/plugins/sourcecred/github/config.json`,
      );
    } catch (error) {
      console.error('configure repos command failed', error);
    }
  }

  async loadSourceCredPlugins() {
    try {
      await executeCommand(
        "cd /Users/sudoferraz/Personal/source-cred/source-cred-instance \
          && yarn clean-all \
          && rm -r data/ledger.json \
          && sed -i '' '5d' config/dependencies.json \
          && yarn sourcecred go",
      );
    } catch (error) {
      console.error('execute command failed', error);
    }
  }

  async loadLocalScInstance(): Promise<UserCredDto[]> {
    const HARDCODED_DIR =
      '/Users/sudoferraz/Personal/source-cred/source-cred-instance';
    const localInstance = await new sc.instance.LocalInstance(HARDCODED_DIR);
    const graph: CredGrainView = await localInstance.readCredGrainView();
    const userDataArray = this.processUserData(graph);
    console.log(userDataArray.slice(0, 5));
    return this.orderUserByCred(userDataArray);
  }

  processUserData(graph: CredGrainView): UserCredDto[] {
    const participantsArray: ParticipantCredGrain[] = graph.participants();
    const userDataArray: UserCredDto[] = participantsArray.map(
      (participant) => {
        return UserCredDto.fromJSON({
          totalCred: participant.cred,
          userName: participant.identity.name,
          type: participant.identity.subtype.toString(),
        });
      },
    );
    return this.orderUserByCred(userDataArray);
  }

  orderUserByCred(userDtoArray: UserCredDto[]): UserCredDto[] {
    return userDtoArray.sort((a, b) => b.totalCred - a.totalCred);
  }

  async saveContribution(userId: string): Promise<ContributionRepoDto> {
    try {
      const contribution = await this.prismaService.contribution.create({
        data: {
          user_id: userId,
          created_at: new Date(),
        }
      });
      return contribution;
    } catch (error) {
      console.error('Error creating contribution run', error);
      throw error;
    }
  }

  async saveUserScore(contributionId: string, userCredDtos: UserCredDto[]) {
    try {
      return await this.prismaService.userScore.createMany({
        data: userCredDtos.map(userCredDto => {
          return {
            username: userCredDto.userName,
            user_type: userCredDto.type,
            score: userCredDto.totalCred,
            created_at: new Date(),
            contribution_id: contributionId
          }
        })
      });
    } catch (error) {
      console.error('Error creating users scores', error);
      throw error;
    }
  }

  async fetchScoreForUser (userId: string): Promise<UserCredDto[]> {
    try {
      const contribution = await this.fetchContribution(userId);
      const scores = await this.fetchUserScore(contribution.id);
      return scores.map(score => {
        return new UserCredDto(score.score.toNumber(), score.username, score.user_type);
      })
    } catch (error) {
      console.error('Error fetching users scores', error);
      throw error;
    }
  }

  async fetchContribution (userId: string): Promise<ContributionRepoDto> {
    try {
      return await this.prismaService.contribution.findFirst({
        where: { user_id: userId },
      });
    } catch (error) {
      console.error('Error fetching users scores', error);
      throw error;
    }
  }

  async fetchUserScore (contributionId: string): Promise<UserScoreRepoDto[]> {
    try {
      const foundScores = await this.prismaService.userScore.findMany({
        where: { contribution_id: contributionId },
      });
      return foundScores;
    } catch (error) {
      console.error('Error fetching users scores', error);
      throw error;
    }
  }
  

}
