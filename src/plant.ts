export interface Crop {
  type: string;
  value: number;
}

export class Plant {
  type: string;
  growthLevel: number;
  maxGrowthLevel: number;
  growthStages: string[];
  growthAmount: number;
  waterRequired: number;
  sunRequired: number;
  cropValue: number;
  icon: string;
  constructor(
    type: string,
    max: number,
    waterReq: number,
    sunReq: number,
    value: number,
    stages: string[],
  ) {
    this.type = type;
    this.growthLevel = 0;
    this.maxGrowthLevel = max;
    this.growthStages = stages;
    this.icon = stages[0];
    this.waterRequired = waterReq;
    this.sunRequired = sunReq;
    this.cropValue = value;
    this.growthAmount = 0;
  }

  grow(currWater: number, currSun: number) {
    if (
      this.growthLevel < this.maxGrowthLevel &&
      currWater >= this.waterRequired &&
      currSun >= this.sunRequired
    ) {
      this.growthLevel++;
      this.growthAmount += this.growthStages.length / (this.maxGrowthLevel + 1);
      console.log("growth amount", this.growthAmount);
      this.icon = this.growthStages[Math.floor(this.growthAmount)];
    }
  }

  harvest(): Crop {
    if (this.growthLevel == this.maxGrowthLevel) {
      return {
        type: this.type,
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
  let plant;
  switch (type) {
    case "carrot":
      plant = new Plant("carrot", 10, 2, 2, 10, [".", "c", "C"]);
      break;
    case "tomato":
      plant = new Plant("tomato", 6, 4, 2, 20, [".", "t", "T"]);
      break;
    case "potato":
      plant = new Plant("potato", 3, 5, 1, 15, [".", "p", "P"]);
      break;
  }
  return plant;
}
