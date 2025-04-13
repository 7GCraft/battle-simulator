import { _ClientImpl } from "boardgame.io/dist/types/src/client/client";
import { Grid, Hex, PartialCubeCoordinates } from "honeycomb-grid";
import { GameState } from "../types/GameState";
import { getUnitsFromClientUnitsAndCoord } from "../util/board";
import { ClientState } from "../types/ClientState";
import { BaseUnit } from "../types/model/BaseUnit";
import Renderer from "../Renderer";
import Unit from "../render/model/unit/unit";

export default class ClickHandler {
   gameClient: _ClientImpl<GameState>;
   grid: Grid<Hex>;
   clientState: ClientState;
   renderer: Renderer;

   constructor(
      gameClient: _ClientImpl<GameState>,
      grid: Grid<Hex>,
      clientState: ClientState,
      renderer: Renderer
   ) {
      this.gameClient = gameClient;
      this.grid = grid;
      this.clientState = clientState;
      this.renderer = renderer;
   }

   handle(offsetX: number, offsetY: number) {
      const tile = this.grid.pointToHex(
         { x: offsetX, y: offsetY },
         { allowOutside: false }
      );

      if (tile === undefined) {
         if (this.clientState.selectedUnit != null) {
            this.renderer.addEvent(
               this.clientState.selectedUnit!.id,
               "selected",
               false
            );
            this.clientState.selectedUnit = null;
         }

         return;
      }

      const state = this.gameClient.getState();
      if (state == null) return;

      const coordinate = { q: tile.q, r: tile.r };
      const unitsOnCoord = getUnitsFromClientUnitsAndCoord(
         [...this.clientState.units.values()],
         coordinate
      );

      if (this.clientState.selectedUnit == null) {
         const isUnitSelected = this.resolveSelection(
            state.ctx.currentPlayer,
            unitsOnCoord
         );

         if (isUnitSelected) {
            this.renderer.addEvent(
               this.clientState.selectedUnit!.id,
               "selected",
               true
            );
         }

         return;
      }

      // const target = unitsOnCoord.filter((unit) => unit.isAlive).shift();

      let isActionSuccessful = false;
      // if (target == null || !target.isAlive) {
      //    isActionSuccessful = this.handleMovement(coordinate);
      // } else {
      //    isActionSuccessful = this.handleFighting(target);
      // }

      if (isActionSuccessful) {
         this.clientState.markedUnitIds.add(this.clientState.selectedUnit.id);
         this.renderer.addEvent(
            this.clientState.selectedUnit!.id,
            "selected",
            false
         );
         this.clientState.selectedUnit = null;
      }
   }

   resolveSelection(currentPlayerId: string, unitsOnCoord: Unit[]) {
      const firstLivingUnit = unitsOnCoord
         .filter((unit) => unit.state.isAlive)
         .shift();

      if (firstLivingUnit == null) return false;
      if (firstLivingUnit.state.playerID != currentPlayerId) {
         alert("Please select your own unit!");
         return false;
      }

      if (this.clientState.markedUnitIds.has(firstLivingUnit.id)) {
         alert("This unit has done an action, choose another unit!");
         return false;
      }

      this.clientState.selectedUnit = firstLivingUnit;
      return true;
   }

   // handleMovement(coordinate: PartialCubeCoordinates) {
   //    const selectedUnit = this.clientState.selectedUnit;
   //    if (selectedUnit === null) {
   //       alert("No unit is being selected!");
   //       return false;
   //    }

   //    this.gameClient.moves.moveUnit(selectedUnit.id, coordinate);

   //    return true;
   // }

   // handleFighting(target: BaseUnit) {
   //    const selectedUnit = this.clientState.selectedUnit;
   //    if (selectedUnit === null) {
   //       alert("No unit is being selected!");
   //       return false;
   //    }

   //    if (selectedUnit.playerID === target.playerID) {
   //       // Validation may be removed in the future
   //       alert("You cannot attack your own unit!");
   //       return false;
   //    }

   //    this.gameClient.moves.fight(selectedUnit.id, target.id);

   //    return true;
   // }
}
