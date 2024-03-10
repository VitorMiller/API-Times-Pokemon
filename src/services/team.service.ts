import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Pokemon } from '@prisma/client';
import { CreateTeamDto } from '../interfaces/create-teamDTO.dto';
import { PokemonService } from './pokemon.service';
import { GetAllTeamsResponse } from '../interfaces/get-allTeamsResponse.interface';
import { GetTeamResponse } from '../interfaces/get-teamResponse.interface';
import { CreateTeamResponse } from 'src/interfaces/create-teamResponse.interface';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService, private readonly pokemonService: PokemonService) {}

  /**
   * This function creates a team based on the provided DTO, which includes the team owner and a list of Pokemon names.
   * It validates the existence of each Pokemon through the PokemonService before creating the team in the database.
   * 
   * @param createTeamDto Data Transfer Object containing team creation details.
   * @returns A promise resolved with the team creation response, including a success message and the team ID.
   */

    async createTeam(createTeamDto:CreateTeamDto): Promise<CreateTeamResponse> {
      
      const pokemons = await this.pokemonService.findManyPokemons(createTeamDto.team);
    
      const team = await this.prisma.team.create({
        data: {
          owner: createTeamDto.user,
          pokemons: {
            create: pokemons.map(pokemon => ({
              pokemon: {
                connect: { id: pokemon.id },
              },
            })),
          },
        },
      });

      const response: CreateTeamResponse = {
        message: 'Team created successfully',
        teamId: team.id, 
      };
      return response; 
    }
  

  /**
   * This function retrieves all teams from the database.
   * Throws a NotFoundException if no teams exist.
   * 
   * @returns A promise resolved with all teams and their details.
   */
    async getAllTeams(): Promise<GetAllTeamsResponse> {
      try{
        const teams =  await this.prisma.team.findMany({
          select: {
          id: true,
          owner: true,
          pokemons: {
              select: {
                pokemon: {
                    select: {
                    id: true,
                    name: true,
                    weight: true,
                    height: true,
                    },
                },
              },
          },
          },
        });
        
        if (teams.length === 0){
          throw new NotFoundException("No teams have been created yet.");
        }
  
        const formatedResponse:GetAllTeamsResponse  = {};
  
        teams.forEach(team => {
          const pokemons: Pokemon[] = team.pokemons.map(tp => tp.pokemon);
          
          formatedResponse[team.id] = {
            owner: team.owner,
            pokemons,
          };
        });
        return formatedResponse;   
      
      } catch(error){
        if (error instanceof NotFoundException) {
          throw error;
        } else {
          throw new InternalServerErrorException("An error occurred while retrieving teams.");
        }
      }  
    }

  /**
   * Fetches all teams associated with a specific user.
   * If the user has no teams, a NotFoundException is thrown.
   * 
   * @param user The username to fetch teams for.
   * @returns A promise resolved with an array of teams owned by the user.
   */

    async getTeamsByUser(user:string): Promise<GetTeamResponse[]>{
      try{
        const teams = await this.prisma.team.findMany({
          where: {
            owner: user,
          },
          select: {
            id:true,
            owner: true,
            pokemons: {
              select: {
                pokemon: {
                  select: {
                    id: true,
                    name: true,
                    weight: true,
                    height: true,
                  },
                },
              },
            },
          },
        });
  
        if(teams.length === 0){
          throw new NotFoundException("This user does not have a team Pokemon registered");
        }
  
        const formatedResponse: GetTeamResponse[] = [];
  
        teams.forEach(team => {
          const pokemons: Pokemon[] = team.pokemons.map(tp => tp.pokemon);
        
          formatedResponse.push({
            teamId: team.id,
            owner: team.owner,
            pokemons,
          });
        });
        return formatedResponse;
      }catch(error){
        if (error instanceof NotFoundException) {
          throw error;
        } else {
          throw new InternalServerErrorException("Failed to retrieve teams. Please try again later.");
        }  
      }
      
    } 

   /**
   * Retrieves detailed information for a specific team by its ID.
   * If no team with the given ID exists, a NotFoundException is thrown.
   * 
   * @param id The unique identifier of the team to retrieve.
   * @returns A promise resolved with the details of the specified team.
   */
    async getTeamById(id:number): Promise<GetTeamResponse>{
      try{
        const team = await this.prisma.team.findUnique({
          where: {
            id: id,
          },
          select: {
            id:true,
            owner: true,
            pokemons: {
              select: {
                pokemon: {
                  select: {
                    id: true,
                    name: true,
                    weight: true,
                    height: true,
                  },
                },
              },
            },
          },
        });
        
        if(!team){
          throw new NotFoundException("This team does not exist.");
        }


        const pokemons: Pokemon[] = team.pokemons.map(tp => tp.pokemon);
       
        const formatedResponse: GetTeamResponse ={
          teamId: team.id,
          owner: team.owner,
          pokemons,
        }

        return formatedResponse;
      }catch(error){
        if (error instanceof NotFoundException) {
          throw error;
        } else {
          throw new InternalServerErrorException("Failed to retrieve team. Please try again later.");
        }
    
      }
      
    } 
}

