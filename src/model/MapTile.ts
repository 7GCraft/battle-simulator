import { PartialCubeCoordinates } from "honeycomb-grid";
import { grid as gridColor } from "../../colors.json";
import * as PIXI from "pixi.js";
import BaseHex from "./Base/TileHex";

class MapTile extends BaseHex {
   cellNumber!: number;
   graphic!: PIXI.Graphics;

   static create(coordinates: PartialCubeCoordinates, cellNumber: number) {
      const hex = new MapTile(coordinates);
      hex.cellNumber = cellNumber;
      hex.graphic = new PIXI.Graphics();
      return hex;
   }

   render() {
      this.graphic.clear();

      let cellColor = gridColor.background;
      if (this.cellNumber > 0) {
         cellColor = gridColor.primary;
      }

      this.graphic
         .poly(this.corners)
         .fill({ color: cellColor })
         .stroke({ width: 1, color: "#999999" });

      this.graphic.removeChildren();
      if (this.cellNumber > 0) {
         const text = new PIXI.Text({ text: this.cellNumber });
         text.x = this.x - text.width / 2;
         text.y = this.y - text.height / 2;
         this.graphic.addChild(text);
      }

      return this.graphic;
   }
}

export default MapTile;
