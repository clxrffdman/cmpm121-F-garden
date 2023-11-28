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
      this.curIcon = this.species.growthStages[Math.floor(this.growthAmount)];
    }
  }

  harvest(): Crop {
    console.log("cropped");
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

//{"a": "apple", "b":"banana", "c":"carrot", "d":"daikon", "e":"eggplant", "f":"fig", "g":"grape", "h":"horseraddish", "i":"indonesianlime", "j":"jackfruit", "k":"kiwi", "l":"lemon", "m":"maize", "n":"nectarine", "o":"orange", "p":"potato", "q":"quince", "r":"raddish", "s":"squash", "t":"tomato", "u":"ugni", "v":"vanilla", "w":"watermelon", "x":"xigua", "y":"yam", "z":"zuccini"}
const plantSpeciesMap: { [key: string]: plantSpecies } = {
  apple: {
    name: "apple",
    maxGrowthLevel: 10,
    waterRequired: 8,
    sunRequired: 2,
    cropValue: 20,
    growthStages: ["_", ".", "a", "A"],
  },
  banana: {
    name: "banana",
    maxGrowthLevel: 11,
    waterRequired: 6,
    sunRequired: 3,
    cropValue: 30,
    growthStages: ["_", ".", "b", "B"],
  },
  carrot: {
    name: "carrot",
    maxGrowthLevel: 4,
    waterRequired: 2,
    sunRequired: 2,
    cropValue: 5,
    growthStages: ["_", ".", "c", "C"],
  },
  daikon: {
    name: "daikon",
    maxGrowthLevel: 4,
    waterRequired: 2,
    sunRequired: 1,
    cropValue: 5,
    growthStages: ["_", ".", "d", "D"],
  },
  eggplant: {
    name: "eggplant",
    maxGrowthLevel: 1,
    waterRequired: 1,
    sunRequired: 1,
    cropValue: 0,
    growthStages: ["_", ".", "e", "E"],
  },
  fig: {
    name: "fig",
    maxGrowthLevel: 6,
    waterRequired: 2,
    sunRequired: 3,
    cropValue: 15,
    growthStages: ["_", ".", "f", "F"],
  },
  grape: {
    name: "grape",
    maxGrowthLevel: 6,
    waterRequired: 1,
    sunRequired: 3,
    cropValue: 10,
    growthStages: ["_", ".", "g", "G"],
  },
  horse_raddish: {
    name: "horse_raddish",
    maxGrowthLevel: 4,
    waterRequired: 1,
    sunRequired: 1,
    cropValue: 5,
    growthStages: ["_", ".", "h", "H"],
  },
  indonesian_lime: {
    name: "indonesian_lime",
    maxGrowthLevel: 7,
    waterRequired: 5,
    sunRequired: 3,
    cropValue: 15,
    growthStages: ["_", ".", "i", "I"],
  },
  jackfruit: {
    name: "jackfruit",
    maxGrowthLevel: 6,
    waterRequired: 2,
    sunRequired: 2,
    cropValue: 10,
    growthStages: ["_", ".", "j", "J"],
  },
  kiwi: {
    name: "kiwi",
    maxGrowthLevel: 4,
    waterRequired: 3,
    sunRequired: 3,
    cropValue: 5,
    growthStages: ["_", ".", "k", "K"],
  },
  lemon: {
    name: "lemon",
    maxGrowthLevel: 10,
    waterRequired: 6,
    sunRequired: 3,
    cropValue: 5,
    growthStages: ["_", ".", "l", "L"],
  },
  maize: {
    name: "maize",
    maxGrowthLevel: 6,
    waterRequired: 4,
    sunRequired: 2,
    cropValue: 10,
    growthStages: ["_", ".", "m", "M"],
  },
  nectarine: {
    name: "nectarine",
    maxGrowthLevel: 8,
    waterRequired: 5,
    sunRequired: 1,
    cropValue: 10,
    growthStages: ["_", ".", "n", "N"],
  },
  orange: {
    name: "orange",
    maxGrowthLevel: 10,
    waterRequired: 9,
    sunRequired: 3,
    cropValue: 30,
    growthStages: ["_", ".", "o", "O"],
  },
  potato: {
    name: "potato",
    maxGrowthLevel: 5,
    waterRequired: 1,
    sunRequired: 2,
    cropValue: 15,
    growthStages: ["_", ".", "p", "P"],
  },
  quince: {
    name: "quince",
    maxGrowthLevel: 4,
    waterRequired: 1,
    sunRequired: 1,
    cropValue: 5,
    growthStages: ["_", ".", "q", "Q"],
  },
  raddish: {
    name: "raddish",
    maxGrowthLevel: 5,
    waterRequired: 2,
    sunRequired: 1,
    cropValue: 10,
    growthStages: ["_", ".", "r", "R"],
  },
  squash: {
    name: "squash",
    maxGrowthLevel: 6,
    waterRequired: 6,
    sunRequired: 2,
    cropValue: 10,
    growthStages: ["_", ".", "s", "S"],
  },
  tomato: {
    name: "tomato",
    maxGrowthLevel: 4,
    waterRequired: 2,
    sunRequired: 2,
    cropValue: 20,
    growthStages: ["_", ".", "t", "T"],
  },
  ugni: {
    name: "ugni",
    maxGrowthLevel: 40,
    waterRequired: 10,
    sunRequired: 3,
    cropValue: 100000,
    growthStages: ["_", ".", "u", "U"],
  },
  vanilla: {
    name: "vanilla",
    maxGrowthLevel: 15,
    waterRequired: 10,
    sunRequired: 1,
    cropValue: 40,
    growthStages: ["_", ".", "v", "V"],
  },
  watermelon: {
    name: "watermelon",
    maxGrowthLevel: 8,
    waterRequired: 6,
    sunRequired: 3,
    cropValue: 30,
    growthStages: ["_", ".", "w", "W"],
  },
  xigua: {
    name: "xigua",
    maxGrowthLevel: 6,
    waterRequired: 5,
    sunRequired: 2,
    cropValue: 10,
    growthStages: ["_", ".", "x", "X"],
  },
  yam: {
    name: "yam",
    maxGrowthLevel: 5,
    waterRequired: 6,
    sunRequired: 2,
    cropValue: 10,
    growthStages: ["_", ".", "y", "Y"],
  },
  zuccini: {
    name: "zuccini",
    maxGrowthLevel: 5,
    waterRequired: 7,
    sunRequired: 2,
    cropValue: 20,
    growthStages: ["_", ".", "z", "Z"],
  },
};
