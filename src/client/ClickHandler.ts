import { _ClientImpl } from "boardgame.io/dist/types/src/client/client";
import MapTile from "../model/MapTile";
import { Grid, PartialCubeCoordinates } from "honeycomb-grid";
import { GameState } from "../types/GameState";
import { getUnitsFromStateAndCoord } from "../util/board";
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
      const unitsOnCoord = getUnitsFromStateAndCoord(state.G, coordinate);

      if (this.clientState.selectedUnit == null) {
         this.resolveSelection(state.ctx.currentPlayer, unitsOnCoord);
         return;
      }

      const target = unitsOnCoord.filter((unit) => unit.isAlive).shift();

      let isActionSuccessful = true;
      if (target == null || !target.isAlive) {
         isActionSuccessful = this.handleMovement(coordinate);
      } else {
         isActionSuccessful = this.handleFighting(target);
      }

      if (isActionSuccessful) {
         this.clientState.markedUnitIds.add(this.clientState.selectedUnit.id);
         this.clientState.selectedUnit = null;
      }
   }

   resolveSelection(currentPlayerId: string, unitsOnCoord: BaseUnit[]) {
      const firstLivingUnit = unitsOnCoord
         .filter((unit) => unit.isAlive)
         .shift();

      if (firstLivingUnit == null) return;
      if (firstLivingUnit.playerID != currentPlayerId) {
         alert("Please select your own unit!");
         return;
      }

      if (this.clientState.markedUnitIds.has(firstLivingUnit.id)) {
         alert("This unit has done an action, choose another unit!");
         return;
      }

      this.clientState.selectedUnit = firstLivingUnit;
   }

   handleMovement(coordinate: PartialCubeCoordinates) {
      const selectedUnit = this.clientState.selectedUnit;
      if (selectedUnit === null) {
         alert("No unit is being selected!");
         return false;
      }

      this.gameClient.moves.moveUnit(selectedUnit.id, coordinate);

      return true;
   }

   handleFighting(target: BaseUnit) {
      const selectedUnit = this.clientState.selectedUnit;
      if (selectedUnit === null) {
         alert("No unit is being selected!");
         return false;
      }

      if (selectedUnit.playerID === target.playerID) {
         // Validation may be removed in the future
         alert("You cannot attack your own unit!");
         return false;
      }

      this.gameClient.moves.fight(selectedUnit.id, target.id);

      return true;
   }
}
