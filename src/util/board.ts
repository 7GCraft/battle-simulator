import { PartialCubeCoordinates } from "honeycomb-grid";
import { GameState } from "../types/GameState";

export const getObjectFromStateAndCoord = (
   state: GameState,
   coordinate: PartialCubeCoordinates
) => {
   const filtered = state.units.filter(
      (unit) =>
         unit.position.q === coordinate.q && unit.position.r === coordinate.r
   );

   return filtered.length > 0 ? filtered[0] : null;
};
