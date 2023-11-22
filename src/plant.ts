export interface Crop {
  type: string;
  value: number;
}

export class Plant {
  species: plantSpecies;
  growthLevel: number;
  growthAmount: number;
  curIcon: string;
  constructor(species: plantSpecies) {
    this.species = species;
    this.growthLevel = 0;
    this.curIcon = species.growthStages[0];
    this.growthAmount = 0;
  }

  grow(currWater: number, currSun: number) {
    if (
      this.growthLevel < this.species.maxGrowthLevel &&
      currWater >= this.species.waterRequired &&
      currSun >= this.species.sunRequired
    ) {
      this.growthLevel++;
      this.growthAmount +=
        this.species.growthStages.length / (this.species.maxGrowthLevel + 1);
      console.log("growth amount", this.growthAmount);
      this.curIcon = this.species.growthStages[Math.floor(this.growthAmount)];
    }
  }

  harvest(): Crop {
    if (this.growthLevel == this.species.maxGrowthLevel) {
      return {
        type: this.species.name,
        value: 10,
      };
    }
    return {
      type: "scraps",
      value: 1,
    };
  }
}

export function makePlant(type: string): Plant | undefined {
  const species = plantSpeciesMap[type];
  if (species) {
    return new Plant(species);
  }
  return undefined;
}

interface plantSpecies {
  name: string;
  maxGrowthLevel: number;
  waterRequired: number;
  sunRequired: number;
  cropValue: number;
  growthStages: string[];
}

const plantSpeciesMap: { [key: string]: plantSpecies } = {
  carrot: {
    name: "carrot",
    maxGrowthLevel: 2,
    waterRequired: 2,
    sunRequired: 2,
    cropValue: 10,
    growthStages: [".", "c", "C"],
  },
  tomato: {
    name: "tomato",
    maxGrowthLevel: 4,
    waterRequired: 2,
    sunRequired: 2,
    cropValue: 20,
    growthStages: [".", "t", "T"],
  },
  potato: {
    name: "potato",
    maxGrowthLevel: 5,
    waterRequired: 1,
    sunRequired: 2,
    cropValue: 15,
    growthStages: [".", "p", "P"],
  },
};
