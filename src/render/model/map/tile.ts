import { Hex, PartialCubeCoordinates } from "honeycomb-grid";
import { grid as gridColor } from "../../../../colors.json";
import MapTileHex from "../base/map-tile-hex";
import { Graphics, Text } from "pixi.js";
import {
   EntityEventParamMap,
   RenderEventHandler,
} from "../../../types/model/base/render-event";

export default class Tile implements RenderEventHandler {
   hex: Hex;
   cellNumber: number;
   graphic: Graphics;
   eventHandlers: Record<string, (...args: any[]) => void>;

   constructor(coordinates: PartialCubeCoordinates, cellNumber: number) {
      this.hex = new MapTileHex(coordinates);
      this.cellNumber = cellNumber;
      this.graphic = new Graphics();
      this.eventHandlers = {};
      this.addSubscribers();
   }

   drawBase() {
      let cellColor = gridColor.background;
      if (this.cellNumber > 0) {
         cellColor = gridColor.primary;
      }

      this.graphic
         .poly(this.hex.corners)
         .fill({ color: cellColor })
         .stroke({ width: 1, color: "#999999" });

      return this;
   }

   displayCellNumber() {
      if (this.cellNumber > 0) {
         const text = new Text({ text: this.cellNumber });
         text.x = this.hex.x - text.width / 2;
         text.y = this.hex.y - text.height / 2;
         this.graphic.addChild(text);
      }

      return this;
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

   addSubscribers(): void {}

   addSubscriber<E extends keyof EntityEventParamMap>(
      event: E,
      handler: (parameter: EntityEventParamMap[E]) => void
   ): void {
      this.eventHandlers[event] = handler;
   }

   consume<E extends keyof EntityEventParamMap>(
      event: E,
      parameter: EntityEventParamMap[E]
   ) {
      this.eventHandlers[event](parameter);
   }
}
