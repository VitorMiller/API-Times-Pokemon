import { Pokemon } from "./pokemon.interface";


export interface Team {
    id: number;
    owner: string;
    pokemons: Pokemon[];
  }