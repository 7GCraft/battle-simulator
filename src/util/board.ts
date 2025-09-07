import { PartialCubeCoordinates } from "honeycomb-grid";
import Unit from "../render/model/unit/unit";

export const getUnitsFromClientUnitsAndCoord = (
   units: Unit[],
   coordinate: PartialCubeCoordinates
) => {
   const filtered = units.filter(
      (unit) =>
         unit.state.position.q === coordinate.q &&
         unit.state.position.r === coordinate.r
   );

   return filtered;
};
