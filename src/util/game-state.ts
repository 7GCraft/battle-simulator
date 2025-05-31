import { UnitState } from "../types/model/unit-state";

export const getUnitFromId = (units: UnitState[], unitID: string) => {
   const filteredUnits = units.filter((unit) => unit.id == unitID);
   return filteredUnits.length === 0 ? null : filteredUnits[0];
};
