import { _ClientImpl } from "boardgame.io/dist/types/src/client/client";
import MapTile from "../model/MapTile";
import { Grid } from "honeycomb-grid";
import { GameState } from "../types/GameState";
import { getObjectFromStateAndCoord } from "../util/board";
import { ClientState } from "../types/ClientState";
import { BaseUnit } from "../types/model/BaseUnit";

export default class ClickHandler {
   gameClient: _ClientImpl<GameState>;
   grid: Grid<MapTile>;
   clientState: ClientState;

   constructor(
      gameClient: _ClientImpl<GameState>,
      grid: Grid<MapTile>,
      clientState: ClientState
   ) {
      this.gameClient = gameClient;
      this.grid = grid;
      this.clientState = clientState;
   }

   handle(offsetX: number, offsetY: number) {
      const tile = this.grid.pointToHex(
         { x: offsetX, y: offsetY },
         { allowOutside: false }
      );

      if (tile === undefined) {
         if (this.clientState.selectedUnit != null) {
            this.clientState.selectedUnit = null;
         }

         return;
      }

      const state = this.gameClient.getState();
      if (state == null) return;

      const coordinate = { q: tile.q, r: tile.r };
      const target = getObjectFromStateAndCoord(state.G, coordinate);

      if (this.clientState.selectedUnit == null) {
         this.resolveSelection(state.ctx.currentPlayer, target);
         return;
      }

      if (target == null) {
         const res = this.gameClient.moves.moveUnit(
            this.clientState.selectedUnit.id,
            coordinate
         );
      }
      // else if (target.id != state.ctx.currentPlayer) {
      //    this.gameClient.moves.fight(target.id);
      // }

      this.clientState.markedUnitIds.add(this.clientState.selectedUnit.id);
      this.clientState.selectedUnit = null;
   }

   resolveSelection(currentPlayerId: string, object: BaseUnit | null) {
      if (object == null) return;
      if (object.playerID != currentPlayerId) {
         alert("Please select your own unit!");
         return;
      }

      if (this.clientState.markedUnitIds.has(object.id)) {
         alert("This unit has done an action, choose another unit!");
         return;
      }

      this.clientState.selectedUnit = object;
   }
}
