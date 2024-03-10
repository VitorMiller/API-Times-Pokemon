import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PokemonService } from '../services/pokemon.service';
import { CreateTeamDto } from '../interfaces/create-teamDTO.dto';
import { TeamsService } from '../services/team.service';


@Controller('api/teams')
export class TeamController {
  constructor(private readonly pokemonService: PokemonService,private readonly teamService: TeamsService ) {}

  @Post()
  async createTeamPokemon(@Body() createTeamDto: CreateTeamDto ) {
    return await this.teamService.createTeam(createTeamDto);
  }

  @Get()
  async getAllTeams(){
    return this.teamService.getAllTeams();
  }

  @Get(':user')
  async getTeamByUser(@Param('user') user: string) {
    return this.teamService.getTeamsByUser(user);
  }

  @Get('/id/:id')
  async getTeamById(@Param('id') id: string) {
    return this.teamService.getTeamById(+id);
  }
  
}
