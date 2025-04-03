import { BaseUnit } from "../types/model/BaseUnit";

export const getUnitFromId = (units: BaseUnit[], unitID: string) => {
   const filteredUnits = units.filter((unit) => unit.id == unitID);
   return filteredUnits.length === 0 ? null : filteredUnits[0];
};
