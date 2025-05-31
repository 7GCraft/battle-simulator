import { GameEvent } from "../types/model/base/game-event";
import { Plugin } from "boardgame.io";

export interface GameEventData {
   lastErrorMessage: string | null;
   eventQueue: GameEvent[]; // If this slows the game, change data structure to queue instead
}

export interface GameEventAPI extends GameEventData {
   enqueue(event: GameEvent): void;
   dequeue(): GameEvent | null;
}

export interface GameEventPlugin {
   gameEvent: GameEventAPI;
}

const GameEventPlugin = (): Plugin<GameEventAPI, GameEventData> => ({
   name: "gameEvent",
   setup: () => ({ lastErrorMessage: null, eventQueue: [] }),
   flush: ({ api }) => ({
      lastErrorMessage: api.lastErrorMessage,
      eventQueue: api.eventQueue,
   }),
   api: () => {
      const eventQueue: GameEvent[] = [];

      const enqueue = (event: GameEvent) => {
         eventQueue.push(event);
      };

      const dequeue = () => {
         if (eventQueue.length === 0) return null;
         return eventQueue.splice(0, 1)[0];
      };

      return {
         lastErrorMessage: null,
         eventQueue,
         enqueue,
         dequeue,
      };
   },
   // fnWrap:
   //    (move, moveType) =>
   //    ({ G, gameEvent, ...rest }, ...args) => {
   //       console.log(moveType);
   //       const result = move({ G, gameEvent, ...rest }, ...args);
   //       if (result !== INVALID_MOVE) gameEvent.lastErrorMessage = null;
   //       return G;
   //    },
});

export default GameEventPlugin;
