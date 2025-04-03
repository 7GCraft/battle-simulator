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

class BattleSimulatorClient {
   client: _ClientImpl<GameState>;
   pixiApp: PIXI.Application;
   grid: Grid<MapTile>;
   units: Unit[];
   clientState: ClientState;

   constructor(pixiApp: PIXI.Application) {
      this.client = Client({ game: BattleSimulator });
      this.client.start();
      this.pixiApp = pixiApp;
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
      const units = initialState.G.units;

      return units.map((unit) => {
         const unitTile = Unit.create(
            unit.id,
            0,
            this.grid.getHex(unit.position)!,
            unit.playerID == "0" ? "blue" : "red"
         );
         pixiApp.stage.addChild(UnitBuilder.renderPrimary(unitTile));
         return unitTile;
      });
   }

   attachListeners() {
      const clickHandler = new ClickHandler(
         this.client,
         this.grid,
         this.clientState
      );
      document.addEventListener("click", ({ offsetX, offsetY }) =>
         clickHandler.handle(offsetX, offsetY)
      );
   }

   update(state: ServerState<GameState>) {
      if (state === null) return;
      const newUnits = [];

      for (let i = 0; i < this.units.length; i++) {
         const unit = this.units[i];
         unit.destroy();

         const unitState = state.G.units[i];
         if (!unitState.isAlive) {
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

         newUnits.push(newUnit);
      }

      this.units = newUnits;

      // if (state.ctx.gameover) {
      //    const textGameOverElement = document.querySelector("#game-over-text")!;
      //    textGameOverElement.textContent =
      //       state.ctx.gameover.winner !== undefined
      //          ? `Player ${state.ctx.gameover.winner} Win!`
      //          : "It's a Draw!";
      // }
   }
}

const pixiApp = new PIXI.Application();
await pixiApp.init({ backgroundAlpha: 0 });

document.querySelector("#game")!.appendChild(pixiApp.canvas);

// Debug Only
globalThis.__PIXI_APP__ = pixiApp;

const app = new BattleSimulatorClient(pixiApp);
