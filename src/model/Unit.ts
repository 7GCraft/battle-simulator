import UnitHex from "./Base/UnitHex";
import MapTile from "./MapTile";
import * as PIXI from "pixi.js";
import { unit as unitColor } from "../../colors.json";
import { PlayerTeamColor } from "../types/config/colors";

// class Player {
class Unit extends UnitHex {
   unitID!: string;
   power!: number;
   positionTile!: MapTile;
   colorKey!: PlayerTeamColor;
   graphic!: PIXI.Graphics;

   // Temporary Create function for Hex Player
   static create(
      unitID: string,
      power: number,
      initialTile: MapTile,
      colorKey: PlayerTeamColor
   ) {
      const hex = new Unit({ q: initialTile.q, r: initialTile.r });
      hex.unitID = unitID;
      hex.power = power;
      hex.positionTile = initialTile;
      hex.colorKey = colorKey;
      hex.graphic = new PIXI.Graphics();
      return hex;
   }

   drawPoly() {
      // Turns original hex corner into shrinked corner
      //    => Linear Transformation - Scaling
      // https://gamemath.com/book/matrixtransforms.html
      const scale = 4 / 5;
      const newCorners = this.corners.map((p) => ({
         x: (p.x - this.x) * scale + this.x,
         y: (p.y - this.y) * scale + this.y,
      }));

      this.graphic.poly(newCorners).stroke({ width: 1, color: "#999999" });

      return this;
   }

   fillColorStyle(style: "primary" | "active" | "disabled") {
      const color = unitColor[this.colorKey][style];
      this.graphic.fill({ color });
      return this;
   }

   addText() {
      const text = new PIXI.Text({ text: this.power });
      text.x = this.x - text.width / 2;
      text.y = this.y - text.height / 2;
      this.graphic.addChild(text);
   }

   reset() {
      this.graphic.removeChildren();
      this.graphic.clear();
      return this;
   }

   destroy() {
      this.reset();
      this.graphic.destroy();
   }
}

export default Unit;
