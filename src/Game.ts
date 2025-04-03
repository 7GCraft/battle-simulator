import { Game } from "boardgame.io";
import { mockBoard, mockUnits } from "./temp/board-mocker";
import { GameState } from "./types/GameState";
import MoveController from "./controller/move-controller";
import FightController from "./controller/fight-controller";

export const BattleSimulator: Game<GameState> = {
   setup: () => {
      const cells = mockBoard();
      const units = mockUnits(cells, 2, 2);
      const unitCountByPlayer: Record<string, number> = {};
      for (let i = 0; i < 2; i++) unitCountByPlayer[i.toString()] = 2;

      return {
         cells: cells,
         units: units,
         unitCountByPlayer,
      };
   },
   minPlayers: 2,
   maxPlayers: 2,
   turn: {
      minMoves: 1,
      // maxMoves: 1,
   },
   moves: {
      ...MoveController.publish(),
      ...FightController.publish(),
   },
   endIf: ({ G, ctx }) => {
      let aboveZeroUnitPlayerIds = [];
      for (let i = 0; i < ctx.numPlayers; i++) {
         if (G.unitCountByPlayer[i.toString()] > 0)
            aboveZeroUnitPlayerIds.push(i.toString());
      }

      if (aboveZeroUnitPlayerIds.length == 0) return { draw: true };
      if (aboveZeroUnitPlayerIds.length == 1)
         return { winner: aboveZeroUnitPlayerIds[0] };
   },
};
