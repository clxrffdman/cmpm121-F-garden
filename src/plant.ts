export interface Crop {
  type: string;
  value: number;
}

export class PlantCell {
  public static numBytes = 3;

  // eslint-disable-next-line no-unused-vars
  constructor(private dataView: DataView) {
    this.waterLevel = 0;
    this.speciesIndex = -1;
    this.growthLevel = -1;
  }

  get waterLevel(): number {
    return this.dataView.getUint8(0);
  }
  get speciesIndex(): number {
    return this.dataView.getInt8(1);
  }
  get growthLevel(): number {
    return this.dataView.getInt8(2);
  }

  set waterLevel(value: number) {
    this.dataView.setUint8(0, value);
  }
  set speciesIndex(value: number) {
    this.dataView.setInt8(1, value);
  }
  set growthLevel(value: number) {
    this.dataView.setInt8(2, value);
  }

  public get curStage(): number {
    if (!this.hasPlant()) return -1;
    return Math.floor((this.growthLevel / this.species!.maxGrowthLevel) * 3);
  }

  public hasPlant(): boolean {
    return this.speciesIndex != -1;
  }

  public get curIcon(): string {
    if (!this.hasPlant()) return " ";
    const icon =
      plantSpeciesArray[this.speciesIndex].growthStages[this.curStage];
    return icon;
  }

  public get species(): plantSpecies | null {
    if (!this.hasPlant()) return null;
    return plantSpeciesArray[this.speciesIndex];
  }

  grow(currWater: number, currSun: number) {
    if (this.hasPlant()) {
      const levelReq = this.growthLevel < this.species!.maxGrowthLevel;
      const waterReq = currWater >= this.species!.waterRequired;
      const sunReq = currSun >= this.species!.sunRequired;
      if (levelReq && waterReq && sunReq) {
        this.growthLevel++;
      }
    }
  }

  harvest(): Crop | null {
    if (this.hasPlant()) {
      console.log("Attempting to harvest: ", this.speciesIndex);
      if (
        this.growthLevel == plantSpeciesArray[this.speciesIndex].maxGrowthLevel
      ) {
        console.log(
          "Harvested the " + plantSpeciesArray[this.speciesIndex].name,
        );
        const currPlant = plantSpeciesArray[this.speciesIndex];
        this.speciesIndex = -1;
        this.growthLevel = -1;
        return {
          type: currPlant.name,
          value: currPlant.cropValue,
        };
      }
      this.speciesIndex = -1;
      this.growthLevel = -1;
      return {
        type: "scraps",
        value: 1,
      };
    }
    return null;
  }
}

interface plantSpecies {
  name: string;
  maxGrowthLevel: number;
  waterRequired: number;
  sunRequired: number;
  cropValue: number;
  growthStages: string[];
}

function createPlantSpecies(
  name: string,
  maxGrowthLevel: number,
  waterRequired: number,
  sunRequired: number,
  cropValue: number,
  growthStages: string[],
): plantSpecies {
  growthStages.unshift("_", ".");
  return {
    name,
    maxGrowthLevel,
    waterRequired,
    sunRequired,
    cropValue,
    growthStages,
  };
}

export const plantSpeciesArray: plantSpecies[] = [
  createPlantSpecies("apple", 10, 8, 2, 20, ["a", "A"]),
  createPlantSpecies("banana", 11, 6, 3, 30, ["b", "B"]),
  createPlantSpecies("carrot", 4, 2, 2, 5, ["c", "C"]),
  createPlantSpecies("daikon", 4, 2, 1, 5, ["d", "D"]),
  createPlantSpecies("eggplant", 6, 4, 2, 10, ["e", "E"]),
  createPlantSpecies("fig", 6, 2, 3, 15, ["f", "F"]),
  createPlantSpecies("grape", 6, 1, 3, 10, ["g", "G"]),
  createPlantSpecies("horse_raddish", 4, 1, 1, 5, ["h", "H"]),
  createPlantSpecies("indonesian_lime", 7, 5, 3, 15, ["i", "I"]),
  createPlantSpecies("jackfruit", 6, 2, 2, 10, ["j", "J"]),
  createPlantSpecies("kiwi", 4, 3, 3, 5, ["k", "K"]),
  createPlantSpecies("lemon", 10, 6, 3, 5, ["l", "L"]),
  createPlantSpecies("maize", 6, 4, 2, 10, ["m", "M"]),
  createPlantSpecies("nectarine", 8, 5, 1, 10, ["n", "N"]),
  createPlantSpecies("orange", 10, 9, 3, 30, ["o", "O"]),
  createPlantSpecies("potato", 5, 1, 2, 15, ["p", "P"]),
  createPlantSpecies("quince", 4, 1, 1, 5, ["q", "Q"]),
  createPlantSpecies("raddish", 5, 2, 1, 10, ["r", "R"]),
  createPlantSpecies("squash", 6, 6, 2, 10, ["s", "S"]),
  createPlantSpecies("tomato", 4, 2, 2, 20, ["t", "T"]),
  createPlantSpecies("ugni", 10, 10, 3, 10, ["u", "U"]),
  createPlantSpecies("vanilla", 14, 10, 1, 40, ["v", "V"]),
  createPlantSpecies("watermelon", 8, 6, 3, 30, ["w", "W"]),
  createPlantSpecies("xigua", 6, 5, 2, 10, ["x", "X"]),
  createPlantSpecies("yam", 5, 6, 2, 10, ["y", "Y"]),
  createPlantSpecies("zuccini", 5, 7, 2, 20, ["z", "Z"]),
];
