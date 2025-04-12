import { Client } from "boardgame.io/client";
import { BattleSimulator } from "./Game";
import {
   ClientState as ServerState,
   _ClientImpl,
} from "boardgame.io/dist/types/src/client/client";
import { Grid, Hex } from "honeycomb-grid";
import * as PIXI from "pixi.js";
import { GameState } from "./types/GameState";
import DebugPanel from "./client/DebugPanel";
import { ClientState } from "./types/ClientState";
import Renderer from "./Renderer";
import MapGenerator from "./render/map-generator";

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

      this.pixiApp = pixiApp;
      this.renderer = new Renderer(pixiApp);

      const [grid, tiles] = new MapGenerator(
         initialStates.G.cells,
         pixiApp
      ).generate();
      this.grid = grid;

      const clientState = {
         selectedUnit: null,
         markedUnitIds: new Set<string>(),
      };

      // FOR DEV & DEBUG
      const debugPanel = new DebugPanel("#debug-panel");
      this.clientState = debugPanel.watch(clientState);

      // FOR PRODUCTION
      // this.clientState = clientState;
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
