import { Pokemon } from "./pokemon.interface";

export interface GetTeamResponse {
      teamId: number;
      owner: string;
      pokemons: Pokemon[];
  }