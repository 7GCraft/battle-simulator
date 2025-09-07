import { defineHex } from "honeycomb-grid";
import gameConfig from "../../../../gameConfig";

export default class UnitHex extends defineHex({
   ...gameConfig.hex,
   dimensions: 30,
}) {}
