import { Application } from "pixi.js";
import { UnitState } from "../types/model/unit-state";
import Unit from "./model/unit/unit";
import idGenerator from "../util/id-generator";

export default class UnitGenerator {
   unitStates: UnitState[];
   startingPlayerId: string;
   pixiApp: Application;

   constructor(
      unitStates: UnitState[],
      startingPlayerId: string,
      pixiApp: Application
   ) {
      this.unitStates = unitStates;
      this.startingPlayerId = startingPlayerId;
      this.pixiApp = pixiApp;
   }

   generate(): [Map<string, Unit>, Map<string, string>] {
      const units = new Map<string, Unit>();
      const unitIdToClientUnitId = new Map<string, string>();
      this.unitStates.forEach((unitState) => {
         // Just to make TypeScript happy
         const generatedIdObj = idGenerator.next();
         const generatedId = generatedIdObj.done ? "" : generatedIdObj.value;

         // MUST DO THIS! Because `unitState` is from `const initialStates` which is constant & readonly.
         const unit = new Unit(generatedId, { ...unitState });

         let fillStyle: "primary" | "active" = "primary";
         if (unitState.playerID === this.startingPlayerId) {
            fillStyle = "active";
         }

         unit.drawBase().fill(fillStyle).displayPower();
         this.pixiApp.stage.addChild(unit.graphic);
         units.set(generatedId, unit);
         unitIdToClientUnitId.set(unitState.id, generatedId);
      });

      return [units, unitIdToClientUnitId];
   }
}
