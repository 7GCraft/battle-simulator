import { Hex } from "honeycomb-grid";
import Entity from "../entity";
import UnitHex from "../base/unit-hex";
import { UnitState } from "../../../types/model/unit-state";
import { unit as unitColor } from "../../../../colors.json";
import { Text } from "pixi.js";

export default class Unit extends Entity<UnitState> {
   hex: Hex;
   isSelected: boolean;

   constructor(id: string, gameState: UnitState) {
      super(id, gameState);
      this.hex = new UnitHex(gameState.position);
      this.isSelected = false;
   }

   drawBase() {
      // Turns original hex corner into shrinked corner
      //    => Linear Transformation - Scaling
      // https://gamemath.com/book/matrixtransforms.html
      const scale = 4 / 5;
      const newCorners = this.hex.corners.map((p) => ({
         x: (p.x - this.hex.x) * scale + this.hex.x,
         y: (p.y - this.hex.y) * scale + this.hex.y,
      }));

      this.graphic.poly(newCorners).stroke({ width: 1, color: "#999999" });

      return this;
   }

   fill(style: "primary" | "active" | "disabled") {
      const colorKey = this.state.playerID === "0" ? "blue" : "red";
      const color = unitColor[colorKey][style];
      this.graphic.fill({ color });
      return this;
   }

   displayPower() {
      const text = new Text({ text: this.state.power });
      text.x = this.hex.x - text.width / 2;
      text.y = this.hex.y - text.height / 2;
      this.graphic.addChild(text);
      return this;
   }

   addSubscribers() {
      this.addSubscriber("selected", (isSelected) => {
         if (isSelected) this.reset().drawBase().fill("primary").displayPower();
         else this.reset().drawBase().fill("active").displayPower();
      });

      this.addSubscriber("move", (coordinate) => {
         // this.state.position.q = coordinate.q!;
         // this.state.position.r = coordinate.r!;

         const delta = {
            q: coordinate.q! - this.hex.q,
            r: coordinate.r! - this.hex.r,
         };

         this.hex = this.hex.translate(delta);
         this.reset().drawBase().fill("primary").displayPower();
      });
   }
}
