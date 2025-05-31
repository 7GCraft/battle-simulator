import { Client } from "boardgame.io/client";
import { BattleSimulator } from "./Game";
import { _ClientImpl } from "boardgame.io/dist/types/src/client/client";
import { Grid, Hex } from "honeycomb-grid";
import * as PIXI from "pixi.js";
import { GameState } from "./types/GameState";
import DebugPanel from "./client/DebugPanel";
import { ClientState, ServerState } from "./types/ClientState";
import Renderer from "./Renderer";
import MapGenerator from "./render/map-generator";
import UnitGenerator from "./render/unit-generator";
import ClickHandler from "./client/ClickHandler";
import { UnitGameEvent } from "./types/model/base/game-event";

class BattleSimulatorClient {
   client: _ClientImpl<GameState>;
   pixiApp: PIXI.Application;
   grid: Grid<Hex>;
   clientState: ClientState;
   renderer: Renderer;

   constructor(pixiApp: PIXI.Application) {
      this.client = Client({ game: BattleSimulator });
      this.client.start();
      const initialStates = this.client.getInitialState();

      const [grid, _] = new MapGenerator(
         initialStates.G.cells,
         pixiApp
      ).generate();
      this.grid = grid;

      const [units, unitIdToClientUnitId] = new UnitGenerator(
         initialStates.G.units,
         initialStates.ctx.currentPlayer,
         pixiApp
      ).generate();

      this.pixiApp = pixiApp;
      this.renderer = new Renderer(pixiApp, units);

      const clientState: ClientState = {
         units: units,
         unitIdToClientUnitId: unitIdToClientUnitId,
         selectedUnit: null,
         markedUnitIds: new Set<string>(),
      };

      // FOR DEV & DEBUG
      // BUGGED BECAUSE ERROR WHEN DEALING WITH CIRCULAR REFERENCES
      // const excludeLists = new Set(["units"]);
      // const debugPanel = new DebugPanel("#debug-panel", excludeLists);
      // this.clientState = debugPanel.watch(clientState);

      // FOR PRODUCTION
      this.clientState = clientState;

      this.attachListeners();
      this.client.subscribe((state) => this.update(state));
   }

   attachListeners() {
      const clickHandler = new ClickHandler(
         this.client,
         this.grid,
         this.clientState,
         this.renderer
      );

      this.pixiApp.canvas.addEventListener("click", ({ offsetX, offsetY }) =>
         clickHandler.handle(offsetX, offsetY)
      );
   }

   update(state: ServerState<GameState>) {
      // When an invalid move happens, it sends update 2 times to the client
      // This logic is used because the first update will contain "transients" property
      if (state === null || state.hasOwnProperty("transients")) return;

      console.log(state.plugins.gameEvent);

      const gameEventState = state.plugins.gameEvent;
      const lastErrorMessage =
         gameEventState.api?.lastErrorMessage ||
         gameEventState.data.lastErrorMessage;

      if (lastErrorMessage !== null) {
         alert(lastErrorMessage);
         return;
      }

      if (gameEventState.data.eventQueue.length === 0) return;

      for (const pushedEvent of gameEventState.data.eventQueue) {
         const serverUnit = state.G.units.filter(
            (unitState) => unitState.id === pushedEvent.unit_id
         )[0]!;
         const clientUnitId = this.clientState.unitIdToClientUnitId.get(
            pushedEvent.unit_id
         )!;
         const clientUnit = this.clientState.units.get(clientUnitId)!;

         if (pushedEvent.event === UnitGameEvent.Move) {
            clientUnit.state.position = serverUnit.position;
            this.renderer.addEvent(clientUnitId, "move", serverUnit.position);
         }
      }

      const selectedUnit = this.clientState.selectedUnit!;
      this.renderer.addEvent(selectedUnit.id, "selected", false);
      this.clientState.markedUnitIds.add(selectedUnit.id);
      this.clientState.selectedUnit = null;
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
