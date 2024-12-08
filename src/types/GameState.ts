import { BaseMapTile } from "./model/BaseMapTile";
import { BaseUnit } from "./model/BaseUnit";

export declare type GameState = {
   cells: BaseMapTile[];
   units: BaseUnit[];
   unitCountByPlayer: Record<string, number>;
};
