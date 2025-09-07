import { MapTileState } from "./model/map-tile-state";
import { UnitState } from "./model/unit-state";

export declare type GameState = {
   cells: MapTileState[];
   units: UnitState[];
   unitCountByPlayer: Record<string, number>;
};
