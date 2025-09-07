import { Graphics } from "pixi.js";
import {
   EntityEventParamMap,
   RenderEventHandler,
} from "../../types/model/base/render-event";

export default abstract class Entity<T> implements RenderEventHandler {
   id: string;
   graphic: Graphics;
   state: T;
   eventHandlers: Record<string, (...args: any[]) => void>;

   constructor(id: string, state: T) {
      this.id = id;
      this.graphic = new Graphics();
      this.state = state;
      this.eventHandlers = {};
      this.addSubscribers();
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

   abstract addSubscribers(): void;

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
