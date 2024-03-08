import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  CredGrainView,
  ParticipantCredGrain,
  sourcecred as sc,
} from 'sourcecred';
import { PrismaService } from 'src/prisma/prisma.service';
import { GitRepoService } from 'src/gitrepo/gitrepo.service';
import { UserCredDto } from '../types/userCredDto';
import { ContributionCalculationDto } from '../types/contributionRepo.dto';
import { UserScoreRepoDto } from '../types/userScoreRepo.dto';
import { executeCommand } from '../utils/bashCommand';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class SourceCredService {
  private readonly sourceCredPath: string;
  private readonly sedCommand: string;
  constructor(
    private readonly gitRepoService: GitRepoService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {
    this.sourceCredPath = this.configService.get('SOURCECRED_INSTANCE_PATH');
    this.sedCommand = this.configService.get('SED_COMMAND');
  }

  async createContributionRequest(
    teamId: string,
    gitHubToken: string,
    email: string
  ): Promise<boolean> {
    const contributionRequest = await this.prismaService.contributionRequest.create({
      data: {
        team_id: teamId,
        access_token: gitHubToken,
        email: email,
      },
    });
    if (contributionRequest) {
      return true;
    }
    return false;
  }

  async calculateCredScores(
    teamId: string,
    gitHubToken: string,
    email: string
  ): Promise<UserCredDto[]> {
    const userRegisteredRepos = await this.gitRepoService.getByTeam(teamId);
    const pluginConfigString = this.craftPluginConfigString(
      userRegisteredRepos.map((repo) => repo.full_name),
    );
    const contribution = await this.saveContribution(teamId);
    await this.configureSourcecredGithubPlugin(pluginConfigString);
    await this.loadSourceCredPlugins(gitHubToken);
    const userCredDtoArray = await this.loadLocalScInstance();
    await this.saveUserScore(contribution.id, userCredDtoArray);
    await this.emailService.sendCalculationCompletedMail(email);
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
        `echo \'{\"repositories\": [${pluginConfigurationString}]}\' > ${this.sourceCredPath}/config/plugins/sourcecred/github/config.json`,
      );
    } catch (error) {
      console.error('configure repos command failed', error);
    }
  }

  async loadSourceCredPlugins(gitHubToken: string) {
    let success = true;
    const cmdList = [
      `cd ${this.sourceCredPath} && yarn clean-all`,
      `rm -r ${this.sourceCredPath}/data/ledger.json`,
      `cd ${this.sourceCredPath} && ${this.sedCommand}`,
      `export SOURCECRED_GITHUB_TOKEN=${gitHubToken} && cd ${this.sourceCredPath} && yarn sourcecred go`,
    ];
    for (let i = 0; i < cmdList.length; i++) {
      try {
        console.log(`Executing cmd: ${cmdList[i]}`);
        await executeCommand(cmdList[i]);
      } catch (error) {
        console.error('execute command failed', error);
        success = false;
      }
    }
    return success;
  }

  async loadLocalScInstance(): Promise<UserCredDto[]> {
    const HARDCODED_DIR = this.sourceCredPath;
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
          credPerInterval: participant.credPerInterval,
          grainEarnedPerInterval: participant.grainEarnedPerInterval,
        });
      },
    );
    return this.orderUserByCred(userDataArray);
  }

  orderUserByCred(userDtoArray: UserCredDto[]): UserCredDto[] {
    return userDtoArray.sort((a, b) => b.totalCred - a.totalCred);
  }

  async saveContribution(teamId: string): Promise<ContributionCalculationDto> {
    try {
      const contribution =
        await this.prismaService.contributionCalculation.create({
          data: {
            team_id: teamId,
          },
        });
      return contribution;
    } catch (error) {
      console.error('Error creating contribution run', error);
      throw error;
    }
  }

  async saveUserScore(
    contributionCalculationId: string,
    userCredDtos: UserCredDto[],
  ) {
    // need to delete the user score and interval for the team before we insert new one
    try {
      for(var i = 0; i < userCredDtos.length; i++) {
        const userScore = await this.prismaService.userScore.create({ 
          data : {
              username: userCredDtos[0].userName,
              user_type: userCredDtos[0].type,
              score: userCredDtos[0].totalCred.toString(),
              contribution_calculation_id: contributionCalculationId,
            }
        });

        await this.prismaService.userScoreInterval.createMany({
          data: userCredDtos[0].credPerInterval.map((interval) => {
            return {
              user_score_id: userScore.id,
              score: interval.toString(),
              interval_start: new Date().getTime().toString(), // TODO we need to get interval from graph
              interval_end: new Date().getTime().toString(), // TODO we need to get interval from graph
            };
          }),
        });
      }
    } catch (error) {
      console.error('Error creating users scores', error);
      throw error;
    }
  }

  async fetchLastContributionScoreForTeam(
    teamId: string,
  ): Promise<UserCredDto[]> {
    try {
      const contribution = await this.fetchContribution(teamId);
      const scores = await this.fetchUserScore(contribution.id);
      return scores.map((score) => {
        return new UserCredDto(
          parseInt(score.score),
          score.username,
          score.user_type,
        );
      });
    } catch (error) {
      console.error('Error fetching users scores', error);
      throw error;
    }
  }

  async fetchContribution(teamId: string): Promise<ContributionCalculationDto> {
    try {
      return await this.prismaService.contributionCalculation.findFirst({
        where: { team_id: teamId },
      });
    } catch (error) {
      console.error('Error fetching users scores', error);
      throw error;
    }
  }

  async fetchUserScore(
    contributionCalculationId: string,
  ): Promise<UserScoreRepoDto[]> {
    try {
      const foundScores = await this.prismaService.userScore.findMany({
        where: { contribution_calculation_id: contributionCalculationId },
      });
      return foundScores;
    } catch (error) {
      console.error('Error fetching users scores', error);
      throw error;
    }
  }
}
