import { Grid } from "honeycomb-grid";
import { BaseMapTile } from "../types/model/BaseMapTile";
import { Application } from "pixi.js";
import Tile from "./model/map/tile";
import MapTileHex from "./model/base/map-tile-hex";

export default class MapGenerator {
   tileStates: BaseMapTile[];
   pixiApp: Application;

   constructor(tileStates: BaseMapTile[], pixiApp: Application) {
      this.tileStates = tileStates;
      this.pixiApp = pixiApp;
   }

   generate(): [Grid<MapTileHex>, Tile[]] {
      const tiles = this.tileStates.map(
         (tileState) => new Tile(tileState.coordinates, tileState.cellNumber)
      );

      const hexGrid = Grid.fromIterable(tiles.map((tile) => tile.hex));

      tiles.forEach((tile) => {
         tile.drawBase().displayCellNumber();
         this.pixiApp.stage.addChild(tile.graphic);
      });

      return [hexGrid, tiles];
   }
}
