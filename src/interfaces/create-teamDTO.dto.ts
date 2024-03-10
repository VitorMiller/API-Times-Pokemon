import { IsString, IsArray, ArrayNotEmpty, IsNotEmpty, ArrayUnique, arrayUnique, Matches } from 'class-validator';

export class CreateTeamDto {
  @IsString({message: "User's name must be a string"})
  @IsNotEmpty({message: "User's name cannot be empty"})
  @Matches(/^\S(.*\S)?$/, {message: 'User name cannot start or end with spaces, and cannot consist solely of spaces.',})
  user: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'The Pokémon list cannot be empty.' })
  @IsString({ each: true, message: 'Each list item must be a string.' })
  @IsNotEmpty({ each: true, message: 'A list item cannot be empty.' })
  @ArrayUnique({message: 'Each Pokémon in the list must be unique.'})
  team: string[];
}
