import { _ClientImpl } from "boardgame.io/dist/types/src/client/client";
import { GameState } from "../types/GameState";
import { ClientState } from "../types/ClientState";

export default class EndTurnHandler {
   gameClient: _ClientImpl<GameState>;
   clientState: ClientState;

   constructor(gameClient: _ClientImpl<GameState>, clientState: ClientState) {
      this.gameClient = gameClient;
      this.clientState = clientState;
   }

   handle() {
      this.gameClient.events.endTurn?.();
      this.clientState.markedUnitIds.clear();
   }
}
