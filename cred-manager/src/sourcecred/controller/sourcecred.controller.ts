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
  constructor(private readonly sourceCredService: SourceCredService) {}

  /**
   * Calculates Cred scores for registered github repositories given
   * a user id, outputting cred scores for all users that contributed
   * on the registered repositories
   **/
  @Get('/user/:userId')
  async calculateCredScores(
    @Res() response: Response,
    @Param('userId') userId: string,
  ): Promise<Response> {
    console.log(
      `Calculating CRED scores for repos registered for user ${userId}`,
    );
    try {
      const credScoresArray = await this.sourceCredService.calculateCredScores(
        userId,
      );
      return response.send(credScoresArray);
    } catch (error) {
      console.error('Failed calculating CRED scores', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Fetch users cred score
   **/
  @Get('/user/:userId')
  async fetchUsersCredScores(
    @Res() response: Response,
    @Param('userId') userId: string,
  ): Promise<Response> {
    console.log(
      `Fetching CRED scores for user ${userId}`,
    );
    try {
      const credScoresArray = await this.sourceCredService.fetchScoreForUser(
        userId,
      );
      return response.send(credScoresArray);
    } catch (error) {
      console.error('Failed calculating CRED scores', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
