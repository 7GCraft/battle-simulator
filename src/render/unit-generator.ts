import { Application } from "pixi.js";
import { BaseUnit } from "../types/model/BaseUnit";
import Unit from "./model/unit/unit";
import generateId from "../util/id-generator";

export default class UnitGenerator {
   unitStates: BaseUnit[];
   startingPlayerId: string;
   pixiApp: Application;

   constructor(
      unitStates: BaseUnit[],
      startingPlayerId: string,
      pixiApp: Application
   ) {
      this.unitStates = unitStates;
      this.startingPlayerId = startingPlayerId;
      this.pixiApp = pixiApp;
   }

   generate() {
      const units = new Map<string, Unit>();
      this.unitStates.forEach((unitState) => {
         // Just to make TypeScript happy
         const generatedId = generateId().next();
         const unit = new Unit(
            generatedId.done ? "" : generatedId.value,
            unitState
         );

         let fillStyle: "primary" | "active" = "primary";
         if (unitState.playerID === this.startingPlayerId) {
            fillStyle = "active";
         }

         unit.drawBase().fill(fillStyle).displayPower();
         this.pixiApp.stage.addChild(unit.graphic);
         units.set(unitState.id, unit);
      });

      return units;
   }
}
