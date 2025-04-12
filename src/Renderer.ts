import gameConfig from "../gameConfig";
import type { Application } from "pixi.js";
import { Event, RenderEventParamMap } from "./types/model/base/event";

class Renderer {
   events: Event<keyof RenderEventParamMap>[];
   pixiApp: Application;

   constructor(app: Application) {
      this.pixiApp = app;
      this.events = [];

      let lastTick = performance.now();

      this.pixiApp.ticker.add((delta: number) => {
         const now = performance.now();
         const tickLimit = 1000 / gameConfig.fps;

         if (now - lastTick >= tickLimit) {
            this.processEvents(delta);

            lastTick = now;
         }
      });
   }

   processEvents(delta: number) {
      for (const event of this.events) {
         // TODO: process event
         // Maybe make event types?
      }

      console.log("Process events called!");

      this.events = [];
   }

   addEvent(event: Event<keyof RenderEventParamMap>) {
      this.events.push(event);
   }
}

export default Renderer;
