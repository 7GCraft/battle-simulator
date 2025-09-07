import { ClientState as BaseServerState } from "boardgame.io/dist/types/src/client/client";
import Unit from "../render/model/unit/unit";
import { DefaultPluginAPIs } from "boardgame.io";
import {
   GameEventAPI,
   GameEventData,
   GameEventPlugin,
} from "../plugins/game-event-plugin";

export declare type ClientState = {
   units: Map<string, Unit>;
   unitIdToClientUnitId: Map<string, string>;
   selectedUnit: Unit | null;
   markedUnitIds: Set<string>; // Need better name
};

type PluginData<A, D> = {
   api?: A;
   data: D;
};

export type ServerState<G extends any = any> = BaseServerState<G> & {
   plugins: {
      gameEvent: PluginData<GameEventAPI, GameEventData>;
      // There are other plugin data, but will only add ours
   };
};
