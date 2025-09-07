import { PartialCubeCoordinates } from "honeycomb-grid";

export declare type UnitState = {
   id: string;
   playerID: string;
   position: PartialCubeCoordinates;
   power: number;
   isAlive: boolean;
};
