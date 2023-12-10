import { PlantInstance, plantSpeciesArray } from "./plantInstances";
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

  public get species(): PlantInstance | null {
    if (!this.hasPlant()) return null;
    return plantSpeciesArray[this.speciesIndex];
  }

  grow(currWater: number, currSun: number) {
    if (this.hasPlant()) {
      if (
        plantSpeciesArray[this.speciesIndex].canGrow(
          this.growthLevel,
          currSun,
          currWater,
        )
      ) {
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
