import * as Config from "../../../colors.json";

export type Player = typeof Config.unit;
export type PlayerTeamColor = keyof typeof Config.unit;
