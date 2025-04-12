import { Client } from "boardgame.io/client";
import { BattleSimulator } from "./Game";
import {
   ClientState as ServerState,
   _ClientImpl,
} from "boardgame.io/dist/types/src/client/client";
import MapTile from "./model/MapTile";
import { Grid } from "honeycomb-grid";
import * as PIXI from "pixi.js";
import Unit from "./model/Unit";
import { GameState } from "./types/GameState";
import ClickHandler from "./client/ClickHandler";
import DebugPanel from "./client/DebugPanel";
import { ClientState } from "./types/ClientState";
import UnitBuilder from "./model/builder/unit-builder";
import EndTurnHandler from "./client/EndTurnHandler";
import { getUnitFromId } from "./util/game-state";
import Renderer from "./Renderer";

class BattleSimulatorClient {
   client: _ClientImpl<GameState>;
   pixiApp: PIXI.Application;
   grid: Grid<MapTile>;
   units: Map<string, Unit>;
   clientState: ClientState;
   renderer: Renderer;

   constructor(pixiApp: PIXI.Application) {
      this.client = Client({ game: BattleSimulator });
      this.client.start();
      this.pixiApp = pixiApp;
      this.renderer = new Renderer(pixiApp);
      this.grid = this.createBoard();
      this.units = this.createUnits();
      const clientState = {
         selectedUnit: null,
         markedUnitIds: new Set<string>(),
      };

      // FOR DEV & DEBUG
      const debugPanel = new DebugPanel("#debug-panel");
      this.clientState = debugPanel.watch(clientState);

      // FOR PRODUCTION
      // this.clientState = clientState;

      this.attachListeners();
      this.client.subscribe((state) => this.update(state));
   }

   createBoard() {
      const initialState = this.client.getInitialState();
      const cells = initialState.G.cells;

      // Temporary code to draw grid here
      const grid = Grid.fromIterable(
         cells.map((cell) => MapTile.create(cell.coordinates, cell.cellNumber))
      );

      grid.forEach((tile) => pixiApp.stage.addChild(tile.render()));
      return grid;
   }

   createUnits() {
      const initialState = this.client.getInitialState();
      const gameUnits = initialState.G.units;
      const units = new Map<string, Unit>();

      gameUnits.forEach((unit) => {
         const unitTile = Unit.create(
            unit.id,
            0,
            this.grid.getHex(unit.position)!,
            unit.playerID == "0" ? "blue" : "red"
         );
         pixiApp.stage.addChild(UnitBuilder.renderPrimary(unitTile));
         units.set(unit.id, unitTile);
      });

      return units;
   }

   attachListeners() {
      const clickHandler = new ClickHandler(
         this.client,
         this.grid,
         this.clientState
      );

      this.pixiApp.canvas.addEventListener("click", ({ offsetX, offsetY }) =>
         clickHandler.handle(offsetX, offsetY)
      );

      const endTurnHandler = new EndTurnHandler(this.client, this.clientState);

      document
         .querySelector("#end-turn-button")
         ?.addEventListener("click", () => {
            const confirm = window.confirm(
               "Are you sure you want to end the turn?"
            );

            if (confirm) endTurnHandler.handle();
         });
   }

   update(state: ServerState<GameState>) {
      if (state === null) return;
      const renderedUnitIDs = this.units.keys();

      for (const unitID of renderedUnitIDs) {
         const unit = this.units.get(unitID)!;
         unit.destroy();

         const unitState = getUnitFromId(state.G.units, unitID);
         if (unitState == null || !unitState.isAlive) {
            this.units.delete(unitID);
            continue;
         }

         const newUnitPosition = unitState.position;
         const tile = this.grid.getHex(newUnitPosition)!;
         const newUnit = Unit.create(
            unitState.id,
            unitState.power,
            tile,
            unitState.playerID == "0" ? "blue" : "red"
         );

         if (this.clientState.markedUnitIds.has(unitState.id)) {
            pixiApp.stage.addChild(UnitBuilder.renderPrimary(newUnit));
         } else {
            pixiApp.stage.addChild(UnitBuilder.renderDisabled(newUnit));
         }

         tile.cellNumber = 0;
         tile.render();

         this.units.set(unitID, newUnit);
      }

      if (state.ctx.gameover) {
         const textGameOverElement = document.querySelector("#game-over-text")!;
         textGameOverElement.textContent =
            state.ctx.gameover.winner !== undefined
               ? `Player ${state.ctx.gameover.winner} Win!`
               : "It's a Draw!";
      }
   }
}

const pixiApp = new PIXI.Application();
await pixiApp.init({ backgroundAlpha: 0 });

document
   .querySelector("#game")!
   .insertBefore(pixiApp.canvas, document.querySelector("#end-turn-button"));

// Debug Only
globalThis.__PIXI_APP__ = pixiApp;

const app = new BattleSimulatorClient(pixiApp);
