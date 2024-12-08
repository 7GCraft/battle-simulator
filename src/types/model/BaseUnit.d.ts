import { PartialCubeCoordinates } from "honeycomb-grid";

export declare type BaseUnit = {
   id: string;
   playerID: string;
   position: PartialCubeCoordinates;
   power: number;
   isAlive: boolean;
};
