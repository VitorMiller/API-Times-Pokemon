import { Module } from '@nestjs/common';
import { TeamController } from './controllers/team.controller';
import { PokemonService } from './services/pokemon.service';
import { PrismaService } from './services/prisma.service';
import { TeamsService } from './services/team.service';

@Module({
  imports: [],
  controllers: [TeamController],
  providers: [PokemonService, PrismaService,TeamsService],
})
export class AppModule {}
