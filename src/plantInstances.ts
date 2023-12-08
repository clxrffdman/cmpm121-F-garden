import { plantSpecies, createPlantSpecies } from "./plant";

//To add a plant to the game you just have to provide these fields
//
//Name
//Maximum growth level
//Water required to grow
//Sun Required to grow
//The value of the plant once harvested
//An array of symbols to be used

export const plantSpeciesArray: plantSpecies[] = [
  createPlantSpecies("apple", 10, 8, 2, 20, ["a", "A"]),
  createPlantSpecies("banana", 11, 6, 3, 30, ["b", "B"]),
  createPlantSpecies("carrot", 4, 2, 2, 5, ["c", "C"]),
];
