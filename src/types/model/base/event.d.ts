import { PartialCubeCoordinates } from "honeycomb-grid";

export interface EntityEventParamMap {
   selected: boolean;
   move: PartialCubeCoordinates;
   damaged: number;
   die: void;
}

export interface MapTileEventParamMap {}

export interface RenderEventParamMap
   extends EntityEventParamMap,
      MapTileEventParamMap {}

// export interface RenderEvent<K extends keyof RenderEventParamMap> {
//    object_id: string;
//    name: K;
//    parameter: RenderEventParamMap[K];
// }

// export interface EventHandlers<E extends keyof RenderEventParamMap> {
//    [event: E]: (parameter: RenderEventParamMap[E]) => void;
// }

export interface RenderEventHandler {
   eventHandlers: Record<string, (...args: any[]) => void>; // Nuclear option

   // NONE OF THIS SHIT WORKS
   // eventHandlers: {
   //    [E in RenderEventParamMap]: (parameter: RenderEventParamMap[E]) => void;
   // };
   // eventHandlers: Record<
   //    Partial<keyof RenderEventParamMap>,
   //    (parameter: RenderEventParamMap[keyof RenderEventParamMap]) => void
   // >;
   // eventHandlers: EventHandlers;
   // eventHandlers: Map<
   //    keyof RenderEventParamMap,
   //    (parameter: RenderEventParamMap[keyof RenderEventParamMap]) => void
   // >;

   addSubscribers(): void;
   addSubscriber<E extends keyof EntityEventParamMap>(
      event: E,
      handler: (parameter: EntityEventParamMap[E]) => void
   ): void;
   consume<E extends keyof EntityEventParamMap>(
      event: E,
      parameter: EntityEventParamMap[E]
   );
}

export interface Event<E extends keyof RenderEventParamMap> {
   object_id: string;
   event: E;
   parameter: RenderEventParamMap[E];
}
