import Unit from "../render/model/unit/unit";

export declare type ClientState = {
   units: Map<string, Unit>;
   selectedUnit: Unit | null;
   markedUnitIds: Set<string>; // Need better name
};
