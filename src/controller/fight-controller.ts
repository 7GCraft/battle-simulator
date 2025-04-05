import { Move } from "boardgame.io";
import { GameState } from "../types/GameState";
import TileHex from "../model/Base/TileHex";
import { distance } from "honeycomb-grid";
import { INVALID_MOVE } from "boardgame.io/core";
import { getUnitFromId } from "../util/game-state";

const fight: Move<GameState> = (
   { G },
   selectedUnitID: string,
   targetUnitID: string
) => {
   const selectedUnit = getUnitFromId(G.units, selectedUnitID);
   const targetUnit = getUnitFromId(G.units, targetUnitID);
   if (selectedUnit == null || targetUnit == null) return INVALID_MOVE;

   const dist = distance(
      TileHex.settings,
      selectedUnit.position,
      targetUnit.position
   );
   if (dist > 1) return INVALID_MOVE;

   const high =
      selectedUnit.power > targetUnit.power ? selectedUnit : targetUnit;
   const low =
      selectedUnit.power > targetUnit.power ? targetUnit : selectedUnit;

   high.power -= low.power;
   low.power = 0;

   if (high.power === 0) {
      high.isAlive = false;
      G.unitCountByPlayer[high.playerID]--;
   }

   low.isAlive = false;
   G.unitCountByPlayer[low.playerID]--;
};

class FightController {
   static publish() {
      return {
         fight,
      };
   }
}

export default FightController;
