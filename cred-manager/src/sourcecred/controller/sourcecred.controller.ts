import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { SourceCredService } from '../service/sourcecred.service';

@Controller('/cred')
export class SourceCredController {
  constructor(private readonly sourceCredService: SourceCredService) { }

  /**
   * Calculates Cred scores for registered github repositories given
   * a team id, outputting cred scores for all users that contributed
   * on the registered repositories
   **/
  @Get('/team/:teamId/:gitHubToken/:email')
  async calculateCredScores(
    @Res() response: Response,
    @Param('teamId') teamId: string,
    @Param('gitHubToken') gitHubToken: string,
    @Param('email') email: string,
  ): Promise<Response> {
    console.log(
      `Calculating CRED scores for repos registered for user ${teamId}`,
    );
    try {
      const credScoresArray = await this.sourceCredService.createContributionRequest(
        teamId,
        gitHubToken,
        email
      );
      return response.send(credScoresArray);
    } catch (error) {
      console.error('Failed calculating CRED scores', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
