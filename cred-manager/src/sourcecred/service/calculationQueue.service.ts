import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "src/prisma/prisma.service";
import { SourceCredService } from "./sourcecred.service";

@Injectable()
export class CalculationQueueService {
  private readonly logger = new Logger(CalculationQueueService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly sourceCredService: SourceCredService,
  ) { }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    this.logger.debug('Called when the current second is 10');
    const semaphore = await this.prismaService.calculationSemaphore.findFirst();

    if (!semaphore) {
      this.logger.debug("Semaphore did not existed, creating new one");
      await this.prismaService.calculationSemaphore.create({
        data: { available: true }
      })
      return;
    }

    if (semaphore.available) {
      const unhandledCalculation = await this.prismaService.contributionRequest.findFirst({
        orderBy: { created_at: 'asc' }
      });
      if (unhandledCalculation) {
        this.logger.debug("Handling unhandled calculation request.");
        // update semaphore to unavailable
        await this.prismaService.calculationSemaphore.update({
          where: { id: semaphore.id },
          data: { available: false }
        })
        // calculate cred scores
        await this.sourceCredService.calculateCredScores(unhandledCalculation.team_id, unhandledCalculation.access_token);
        // delete the contribution request
        await this.prismaService.contributionRequest.delete({
          where: { id: unhandledCalculation.id }
        });
        // update semaphore to available
        await this.prismaService.calculationSemaphore.update({
          where: { id: semaphore.id },
          data: { available: true }
        });

      } else {
        this.logger.debug("No unhandled calculation request.");
      }
    } else {
      this.logger.debug("Semaphore unavailable.");
    }
    return;
  }

}
