export class Plant {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  
  // eslint-disable-next-line no-unused-vars
  canGrow(_growth:number, _sun:number, _water:number):boolean{return false}
}

export class PlantInstance extends Plant {
  maxGrowthLevel: number;
  waterRequired: number;
  sunRequired: number;
  cropValue: number;
  growthStages: string[];

  constructor(
    name: string,
    maxGrowthLevel: number,
    waterRequired: number,
    sunRequired: number,
    cropValue: number,
    growthStages: string[],
  ) {
    super(name);
    this.maxGrowthLevel = maxGrowthLevel;
    this.waterRequired = waterRequired;
    this.sunRequired = sunRequired;
    this.cropValue = cropValue;
    this.growthStages = growthStages;
    this.growthStages.unshift("_", ".");
  }

  canGrow(growth:number, sun:number, water:number): boolean {
    return growth < this.maxGrowthLevel && sun >= this.sunRequired && water >= this.waterRequired;
  }
}

//To add a plant to the game you just have to provide these fields
//
//Name
//Maximum growth level
//Water required to grow
//Sun Required to grow
//The value of the plant once harvested
//An array of symbols to be used

export const plantSpeciesArray: PlantInstance[] = [
  new PlantInstance("apple", 10, 8, 2, 20, ["a", "A"]),
  new PlantInstance("banana", 11, 6, 3, 30, ["b", "B"]),
  new PlantInstance("carrot", 4, 2, 2, 5, ["c", "C"]),
];
