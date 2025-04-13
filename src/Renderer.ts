import gameConfig from "../gameConfig";
import type { Application } from "pixi.js";
import { Event, RenderEventParamMap } from "./types/model/base/event";
import Unit from "./render/model/unit/unit";

class Renderer {
   events: Event<keyof RenderEventParamMap>[];
   pixiApp: Application;
   units: Map<string, Unit>;

   constructor(app: Application, units: Map<string, Unit>) {
      this.pixiApp = app;
      this.events = [];
      this.units = units;

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
         const unit = this.units.get(event.object_id);
         if (unit === undefined) continue;
         unit.consume(event.event, event.parameter);
      }

      this.events = [];
   }

   addEvent<E extends keyof RenderEventParamMap>(
      object_id: string,
      event: E,
      parameter: RenderEventParamMap[E]
   ) {
      this.events.push({ object_id, event, parameter });
   }
}

export default Renderer;
