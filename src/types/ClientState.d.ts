import Unit from "../model/Unit";
import { BaseUnit } from "./model/BaseUnit";

export declare type ClientState = {
   selectedUnit: BaseUnit | null;
   markedUnitIds: Set<string>; // Need better name
};
