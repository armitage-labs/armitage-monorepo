import { Module } from '@nestjs/common';
import { GitRepoModule } from 'src/gitrepo/gitrepo.module';
import { SourceCredController } from './controller/sourcecred.controller';
import { SourceCredService } from './service/sourcecred.service';

@Module({
  imports: [GitRepoModule],
  controllers: [SourceCredController],
  providers: [SourceCredService],
})
export class SourceCredModule {}
