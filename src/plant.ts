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
    return Math.floor((this.growthLevel / this.species.maxGrowthLevel) * 3);
  }

  public hasPlant(): boolean {
    return this.speciesIndex != -1;
  }

  public get curIcon(): string {
    if (this.speciesIndex == -1) return " ";
    const icon = plantSpeciesArray[this.speciesIndex].growthStages[0];
    return icon;
  }

  public get species(): plantSpecies {
    return plantSpeciesArray[this.speciesIndex];
  }

  grow(currWater: number, currSun: number) {
    if (
      this.growthLevel < this.species.maxGrowthLevel &&
      currWater >= this.species.waterRequired &&
      currSun >= this.species.sunRequired
    ) {
      this.growthLevel++;
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

//{"a": "apple", "b":"banana", "c":"carrot", "d":"daikon", "e":"eggplant", "f":"fig", "g":"grape", "h":"horseraddish", "i":"indonesianlime", "j":"jackfruit", "k":"kiwi", "l":"lemon", "m":"maize", "n":"nectarine", "o":"orange", "p":"potato", "q":"quince", "r":"raddish", "s":"squash", "t":"tomato", "u":"ugni", "v":"vanilla", "w":"watermelon", "x":"xigua", "y":"yam", "z":"zuccini"}
export const plantSpeciesArray: plantSpecies[] = [
  {
    name: "apple",
    maxGrowthLevel: 10,
    waterRequired: 8,
    sunRequired: 2,
    cropValue: 20,
    growthStages: ["_", ".", "a", "A"],
  },
  {
    name: "banana",
    maxGrowthLevel: 11,
    waterRequired: 6,
    sunRequired: 3,
    cropValue: 30,
    growthStages: ["_", ".", "b", "B"],
  },
  {
    name: "carrot",
    maxGrowthLevel: 4,
    waterRequired: 2,
    sunRequired: 2,
    cropValue: 5,
    growthStages: ["_", ".", "c", "C"],
  },
  {
    name: "daikon",
    maxGrowthLevel: 4,
    waterRequired: 2,
    sunRequired: 1,
    cropValue: 5,
    growthStages: ["_", ".", "d", "D"],
  },
  {
    name: "eggplant",
    maxGrowthLevel: 6,
    waterRequired: 4,
    sunRequired: 2,
    cropValue: 10,
    growthStages: ["_", ".", "e", "E"],
  },
  {
    name: "fig",
    maxGrowthLevel: 6,
    waterRequired: 2,
    sunRequired: 3,
    cropValue: 15,
    growthStages: ["_", ".", "f", "F"],
  },
  {
    name: "grape",
    maxGrowthLevel: 6,
    waterRequired: 1,
    sunRequired: 3,
    cropValue: 10,
    growthStages: ["_", ".", "g", "G"],
  },
  {
    name: "horse_raddish",
    maxGrowthLevel: 4,
    waterRequired: 1,
    sunRequired: 1,
    cropValue: 5,
    growthStages: ["_", ".", "h", "H"],
  },
  {
    name: "indonesian_lime",
    maxGrowthLevel: 7,
    waterRequired: 5,
    sunRequired: 3,
    cropValue: 15,
    growthStages: ["_", ".", "i", "I"],
  },
  {
    name: "jackfruit",
    maxGrowthLevel: 6,
    waterRequired: 2,
    sunRequired: 2,
    cropValue: 10,
    growthStages: ["_", ".", "j", "J"],
  },
  {
    name: "kiwi",
    maxGrowthLevel: 4,
    waterRequired: 3,
    sunRequired: 3,
    cropValue: 5,
    growthStages: ["_", ".", "k", "K"],
  },
  {
    name: "lemon",
    maxGrowthLevel: 10,
    waterRequired: 6,
    sunRequired: 3,
    cropValue: 5,
    growthStages: ["_", ".", "l", "L"],
  },
  {
    name: "maize",
    maxGrowthLevel: 6,
    waterRequired: 4,
    sunRequired: 2,
    cropValue: 10,
    growthStages: ["_", ".", "m", "M"],
  },
  {
    name: "nectarine",
    maxGrowthLevel: 8,
    waterRequired: 5,
    sunRequired: 1,
    cropValue: 10,
    growthStages: ["_", ".", "n", "N"],
  },
  {
    name: "orange",
    maxGrowthLevel: 10,
    waterRequired: 9,
    sunRequired: 3,
    cropValue: 30,
    growthStages: ["_", ".", "o", "O"],
  },
  {
    name: "potato",
    maxGrowthLevel: 5,
    waterRequired: 1,
    sunRequired: 2,
    cropValue: 15,
    growthStages: ["_", ".", "p", "P"],
  },
  {
    name: "quince",
    maxGrowthLevel: 4,
    waterRequired: 1,
    sunRequired: 1,
    cropValue: 5,
    growthStages: ["_", ".", "q", "Q"],
  },
  {
    name: "raddish",
    maxGrowthLevel: 5,
    waterRequired: 2,
    sunRequired: 1,
    cropValue: 10,
    growthStages: ["_", ".", "r", "R"],
  },
  {
    name: "squash",
    maxGrowthLevel: 6,
    waterRequired: 6,
    sunRequired: 2,
    cropValue: 10,
    growthStages: ["_", ".", "s", "S"],
  },
  {
    name: "tomato",
    maxGrowthLevel: 4,
    waterRequired: 2,
    sunRequired: 2,
    cropValue: 20,
    growthStages: ["_", ".", "t", "T"],
  },
  {
    name: "ugni",
    maxGrowthLevel: 10,
    waterRequired: 10,
    sunRequired: 3,
    cropValue: 10,
    growthStages: ["_", ".", "u", "U"],
  },
  {
    name: "vanilla",
    maxGrowthLevel: 14,
    waterRequired: 10,
    sunRequired: 1,
    cropValue: 40,
    growthStages: ["_", ".", "v", "V"],
  },
  {
    name: "watermelon",
    maxGrowthLevel: 8,
    waterRequired: 6,
    sunRequired: 3,
    cropValue: 30,
    growthStages: ["_", ".", "w", "W"],
  },
  {
    name: "xigua",
    maxGrowthLevel: 6,
    waterRequired: 5,
    sunRequired: 2,
    cropValue: 10,
    growthStages: ["_", ".", "x", "X"],
  },
  {
    name: "yam",
    maxGrowthLevel: 5,
    waterRequired: 6,
    sunRequired: 2,
    cropValue: 10,
    growthStages: ["_", ".", "y", "Y"],
  },
  {
    name: "zuccini",
    maxGrowthLevel: 5,
    waterRequired: 7,
    sunRequired: 2,
    cropValue: 20,
    growthStages: ["_", ".", "z", "Z"],
  },
];
