import { Pokemon } from "./pokemon.interface";

export interface GetAllTeamsResponse {
    [key: number]: {
      owner: string;
      pokemons: Pokemon[];
    };
  }