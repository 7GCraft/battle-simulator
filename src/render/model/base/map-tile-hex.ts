import { defineHex } from "honeycomb-grid";
import gameConfig from "../../../../gameConfig";

export default class MapTileHex extends defineHex(gameConfig.hex) {}
