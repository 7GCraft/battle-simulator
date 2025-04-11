import gameConfig from "../gameConfig";
import type { Application } from "pixi.js";

class Renderer {
   events: any[];
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

      console.log("Process events called!")

      this.events = [];
   }

   addEvent(event: any) {
      this.events.push(event);
   }
}

export default Renderer;