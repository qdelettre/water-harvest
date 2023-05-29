import { RUNOFF } from "./runoff";

export const RUNOFF_FACTOR = {
  [RUNOFF.AsphaltShingleRoof]: 0.8,
  [RUNOFF.MetalRoof]: 0.7,
  [RUNOFF.ConcreteTileRoof]: 0.625,
  [RUNOFF.ClayTileRoof]: 0.625,
  [RUNOFF.SlateRoof]: 0.55,
  [RUNOFF.WoodShakeOrShingleRoof]: 0.55,
} as const;
