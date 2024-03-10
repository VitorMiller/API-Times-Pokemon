import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { Pokemon } from '../interfaces/pokemon.interface';
import { PrismaService } from './prisma.service';

@Injectable()
export class PokemonService {

  constructor(private readonly  prisma: PrismaService){}


    /**
   * This function searches for a list of Pokémon names and returns the details of those Pokémon.
   * First attempts to find each Pokémon in the database. If not found,
   * searches the PokeAPI and returns the data. Pokémon not found results in an exception.
   * 
   * @param pokemonsList An array of Pokémon names to search for.
   * @returns A promise that resolves to an array of found Pokémon.
   */

  async findManyPokemons(pokemonsList: string[]): Promise<Pokemon[]>{
    
    const requests = pokemonsList.map(name => this.findOnePokemon(name));
    const pokemons = await Promise.allSettled(requests);
    
    const successfulPokemons: Pokemon[] = [];
    const failedPokemons: String[] = [];
    
    pokemons.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successfulPokemons.push(result.value);
      }else {
        failedPokemons.push(pokemonsList[index]);
        if(result.reason.name == "BadRequestException"){
          throw new BadRequestException('An item in the list cannot consist solely of a space or special characters.');
        }
      }
    });
    
    if (failedPokemons.length > 0) {
      throw new NotFoundException(`Pokemon(s): ${failedPokemons.join(" and ")} was/were not found. For this reason, the team can not be created. Please, check your Internet Connection, and also, ensure that the names of the Pokémon are spelled correctly.`);
    }else{
      for (const pokemon of successfulPokemons){
        await this.addPokemon(pokemon)
      }
    }
    return successfulPokemons;
  }
    

  /**
   * This fuction searches for a single Pokémon by name. First checks if the Pokémon already exists in the database.
   * If not, searches the PokeAPI and returns the found data.
   * 
   * @param name The name of the Pokémon to search for.
   * @returns A promise that resolves to the Pokémon details.
   */
  async findOnePokemon(name: string): Promise<Pokemon>{
    
    const formattedName = name.trim().toLowerCase()
                                      .replace(/\s+/g, ' ')
                                      .replace(/[\s.:]+/g, '-')
                                      .replace(/^-+/, '')
                                      .replace(/[']+/g, '')
                                      .replace(/-+$/, '');

    if (formattedName === '') {
        throw new BadRequestException();
    }
    
    const storedPokemon = await this.prisma.pokemon.findFirst({
      where: { name: formattedName  },
    });

    if(!storedPokemon){
      const url = `https://pokeapi.co/api/v2/pokemon/${formattedName }`;
      const response = await axios.get(url);
      const pokemonData = response.data
      const pokemon: Pokemon = {
        id: pokemonData.id,
        name: pokemonData.name,
        weight: pokemonData.weight,
        height: pokemonData.height
      }
      return pokemon;
    }
    return storedPokemon;
  }

  /**
   * Adds a new Pokémon to the database if it does not already exist.
   * 
   * @param pokemon The details of the Pokémon to be added.
   * @returns A promise that resolves to the added or existing Pokémon.
   */
  async addPokemon(pokemon: Pokemon): Promise<Pokemon> {
    let existingPokemon = await this.prisma.pokemon.findUnique({
      where: { id: pokemon.id },
    });

    if (!existingPokemon) {
      existingPokemon = await this.prisma.pokemon.create({
        data: pokemon,
      });
    }
    return existingPokemon;
  }


}
