import UnitHex from "./Base/UnitHex";
import MapTile from "./MapTile";
import * as PIXI from "pixi.js";
import { player as playerColor } from "../../colors.json";
import { PlayerTeamColor } from "../types/config/colors";

// class Player {
class Unit extends UnitHex {
   power!: number;
   positionTile!: MapTile;
   colorKey!: PlayerTeamColor;
   graphic!: PIXI.Graphics;

   // constructor(initialTile: MapTile, colorKey: string) {
   //    this.power = 0;
   //    this.positionTile = initialTile;
   //    this.colorKey = colorKey;
   // }

   // Temporary Create function for Hex Player
   static create(
      power: number,
      initialTile: MapTile,
      colorKey: PlayerTeamColor
   ) {
      const hex = new Unit({ q: initialTile.q, r: initialTile.r });
      hex.power = power;
      hex.positionTile = initialTile;
      hex.colorKey = colorKey;
      hex.graphic = new PIXI.Graphics();
      return hex;
   }

   render() {
      this.graphic.clear();

      const color = playerColor[this.colorKey].active;

      // Turns original hex corner into shrinked corner
      //    => Linear Transformation - Scaling
      // https://gamemath.com/book/matrixtransforms.html
      const scale = 4 / 5;
      const newCorners = this.corners.map((p) => ({
         x: (p.x - this.x) * scale + this.x,
         y: (p.y - this.y) * scale + this.y,
      }));

      this.graphic
         .poly(newCorners)
         .fill({ color })
         .stroke({ width: 1, color: "#999999" });

      this.graphic.removeChildren();

      const text = new PIXI.Text({ text: this.power });
      text.x = this.x - text.width / 2;
      text.y = this.y - text.height / 2;
      this.graphic.addChild(text);

      return this.graphic;
   }

   destroy() {
      this.graphic.removeChildren();
      this.graphic.clear();
      this.graphic.destroy();
   }
}

export default Unit;
