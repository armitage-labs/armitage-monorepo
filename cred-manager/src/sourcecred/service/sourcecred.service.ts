import { Injectable } from '@nestjs/common';
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
import { Prisma } from '@prisma/client';
import * as fs from 'fs';
import { WeightConfigService } from './weightConfig.service';
import { CacheService } from './cache.service';
import { UsersContibutionMetricsDto } from '../types/userContibutionMetric.dto';

@Injectable()
export class SourceCredService {
  private readonly sourceCredPath: string;
  private readonly sourceCredCacheDbPath: string;
  constructor(
    private readonly gitRepoService: GitRepoService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly weightConfigService: WeightConfigService,
    private readonly emailService: EmailService,
    private readonly cacheService: CacheService,
  ) {
    this.sourceCredPath = this.configService.get('SOURCECRED_INSTANCE_PATH');
    this.sourceCredCacheDbPath = this.configService.get(
      'SOURCECRED_CACHE_DB_PATH',
    );
  }

  async createContributionRequest(
    teamId: string,
    gitHubToken: string,
    email: string,
  ): Promise<boolean> {
    const contributionRequest =
      await this.prismaService.contributionRequest.create({
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
    email: string,
  ): Promise<UserCredDto[]> {
    const userRegisteredRepos = await this.gitRepoService.getByTeam(teamId);
    const pluginConfigString = this.craftPluginConfigString(
      userRegisteredRepos.map((repo) => repo.full_name),
    );
    await this.resetSourceCred();
    await this.configureWeights(teamId);
    await this.configureSourcecredGithubPlugin(pluginConfigString);
    await this.startSourceCredCalculation(gitHubToken);
    const credGrainView = await this.loadLocalScInstance();
    const userCredDtoArray = this.extractUserData(credGrainView);

    const databases = await this.cacheService.getSqlLiteDatabase(
      this.sourceCredCacheDbPath,
    );

    await this.deleteContribution(teamId);
    const contribution = await this.saveContribution(teamId, credGrainView);
    await this.saveUserScore(contribution.id, userCredDtoArray);

    for (let i = 0; i < databases.length; i++) {
      const database = databases[i];
      const credMetrics = await this.loadLocalScMetrics(database);
      const repoName = await this.getRepositoryName(database);
      await this.saveUserMetrics(contribution.id, repoName, credMetrics);
    }

    await this.emailService.sendCalculationCompletedMail(email);
    await this.resetSourceCred();
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

  async startSourceCredCalculation(gitHubToken: string) {
    let success = true;
    const cmdList = [
      `export SOURCECRED_GITHUB_TOKEN=${gitHubToken} && cd ${this.sourceCredPath} && yarn sourcecred go`,
      `ls -la ${this.sourceCredPath}/cache/sourcecred/github`,
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

  async resetSourceCred() {
    try {
      await executeCommand(`cd ${this.sourceCredPath} && yarn clean-all`);
      await executeCommand(`rm -rf ${this.sourceCredPath}/data/ledger.json`);
      await executeCommand(`rm -rf ${this.sourceCredPath}/config/weights.json`);
      await this.resetDependencies();
    } catch (error) {
      console.error('execute command failed', error);
    }
  }

  async resetDependencies() {
    const filePath = `${this.sourceCredPath}/config/dependencies.json`;
    const dependenciesJson = fs.readFileSync(filePath, 'utf8').toString();
    const content: any[] = JSON.parse(dependenciesJson);
    content.forEach((value) => {
      delete value.id;
    });
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
  }

  async configureWeights(teamId: string) {
    const configs = await this.weightConfigService.getTeamWeightConfigs(teamId);
    const sCConfig =
      await this.weightConfigService.transformTeamWeightConfigsToScJsonStringified(
        configs,
      );
    const filePath = `${this.sourceCredPath}/config/weights.json`;
    fs.writeFileSync(filePath, JSON.stringify(sCConfig, null, 2));
  }

  async loadLocalScInstance(): Promise<CredGrainView> {
    const HARDCODED_DIR = this.sourceCredPath;
    const localInstance = await new sc.instance.LocalInstance(HARDCODED_DIR);
    const graph: CredGrainView = await localInstance.readCredGrainView();
    return graph;
  }

  async loadLocalScMetrics(
    database: any,
  ): Promise<UsersContibutionMetricsDto[]> {
    return await this.cacheService.getUsersContributiosnMetrics(database);
  }

  async getRepositoryName(database: any): Promise<string> {
    return await this.cacheService.getRepositoryName(database);
  }

  extractUserData(graph: CredGrainView): UserCredDto[] {
    const userDataArray = this.processUserData(graph);
    return this.orderUserByCred(userDataArray);
  }

  processUserData(graph: CredGrainView): UserCredDto[] {
    const participantsArray: ParticipantCredGrain[] = graph.participants();
    const userDataArray: UserCredDto[] = participantsArray.map(
      (participant) => {
        const credPerInterval: any[] = participant.credPerInterval.map(
          (interval, index) => {
            return {
              value: interval,
              sTime: graph.intervals()[index].startTimeMs,
              eTime: graph.intervals()[index].endTimeMs,
            };
          },
        );
        return UserCredDto.fromJSON({
          totalCred: participant.cred,
          userName: participant.identity.name,
          type: participant.identity.subtype.toString(),
          credPerInterval: credPerInterval,
          grainEarnedPerInterval: participant.grainEarnedPerInterval,
        });
      },
    );
    return this.orderUserByCred(userDataArray);
  }

  orderUserByCred(userDtoArray: UserCredDto[]): UserCredDto[] {
    return userDtoArray.sort((a, b) => b.totalCred - a.totalCred);
  }

  async deleteContribution(teamId: string) {
    const contribution =
      await this.prismaService.contributionCalculation.findFirst({
        where: {
          team_id: teamId,
        },
      });

    if (contribution != null) {
      await this.prismaService.contributionCalculation.deleteMany({
        where: {
          id: contribution.id,
        },
      });
    }
  }

  async saveContribution(
    teamId: string,
    graph: CredGrainView,
  ): Promise<ContributionCalculationDto> {
    try {
      const totalCredPerInterval: any[] = graph
        .totalCredPerInterval()
        .map((interval, index) => {
          return {
            value: interval,
            sTime: graph.intervals()[index].startTimeMs,
            eTime: graph.intervals()[index].endTimeMs,
          };
        });

      const contribution =
        await this.prismaService.contributionCalculation.create({
          data: {
            team_id: teamId,
            score_interval: totalCredPerInterval,
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
    try {
      for (let i = 0; i < userCredDtos.length; i++) {
        const userScore = await this.prismaService.userScore.create({
          data: {
            username: userCredDtos[i].userName,
            user_type: userCredDtos[i].type,
            score: userCredDtos[i].totalCred.toString(),
            score_interval: userCredDtos[i].credPerInterval as Prisma.JsonArray,
            contribution_calculation_id: contributionCalculationId,
          },
        });
      }
    } catch (error) {
      console.error('Error creating users scores', error);
      throw error;
    }
  }

  async saveUserMetrics(
    contributionCalculationId: string,
    repoName: string,
    usersContibutionMetrics: UsersContibutionMetricsDto[],
  ) {
    try {
      const userScore = await this.prismaService.userTeamMetric.createMany({
        data: usersContibutionMetrics.map((metrics) => ({
          username: metrics.username,
          contribution_calculation_id: contributionCalculationId,
          repo_name: repoName,
          metric_name: metrics.metric,
          metric_count: metrics.count.toString(),
        })),
      });
    } catch (error) {
      console.error('Error creating users metrics', error);
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
