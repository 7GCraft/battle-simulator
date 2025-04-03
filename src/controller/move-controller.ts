import { PartialCubeCoordinates, distance, toCube } from "honeycomb-grid";
import { INVALID_MOVE } from "boardgame.io/core";
import { Move } from "boardgame.io";
import { GameState } from "../types/GameState";
import TileHex from "../model/Base/TileHex";
import { getUnitFromId } from "../util/game-state";

const moveUnit: Move<GameState> = (
   { G, playerID },
   unitID: string,
   target: PartialCubeCoordinates
) => {
   const unit = getUnitFromId(G.units, unitID);
   if (unit == null) return INVALID_MOVE;

   const dist = distance(TileHex.settings, unit.position, target);
   if (dist > 1 || dist == 0) return INVALID_MOVE;
   unit.position = target;

   const currCoordinates = toCube(TileHex.settings, target);
   const targetCell = G.cells.filter((cell) => {
      return (
         currCoordinates.q === cell.coordinates.q &&
         currCoordinates.r === cell.coordinates.r
      );
   })[0];

   if (targetCell.cellNumber > 0) {
      unit.power += targetCell.cellNumber;
      targetCell.cellNumber = 0;
   }
};

class MoveController {
   static publish() {
      return {
         moveUnit,
      };
   }
}

export default MoveController;
