import gameConfig from "../gameConfig";
import type { Application } from "pixi.js";

class Renderer {
   events: any[];
   pixiApp: Application;

   constructor(app: Application) {
      this.pixiApp = app;
      this.events = [];

      let elapsed = 0.0;
      this.pixiApp.ticker.add((delta) => {
         const now = new Date().getTime();
         const diff = now - elapsed;
         const tickLimit = 1000 / gameConfig.fps;
         if (diff < tickLimit) return;

         elapsed = now;
      });
   }

   processEvents() {
      // TODO
   }

   addEvent(event: any) {
      this.events.push(event);
   }
}
