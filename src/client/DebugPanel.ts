import { ClientState } from "../types/ClientState";

export default class DebugPanel {
   debugPanelElement: Element;

   constructor(panelSelector: string) {
      this.debugPanelElement = document.querySelector(panelSelector)!;
   }

   watch(clientState: ClientState) {
      this.debugPanelElement.innerHTML =
         this.getHtmlContentFromState(clientState);
      return new Proxy(clientState, {
         set: (t, p, v) => {
            Reflect.set(t, p, v);
            this.debugPanelElement.innerHTML = this.getHtmlContentFromState(t);
            return true;
         },
      });
   }

   getHtmlContentFromState(state: ClientState) {
      let html = "";
      for (const prop in state) {
         const val = state[prop as keyof ClientState];
         html += `${prop}: ${this.getStringContentFrom(val)} <br>`;
      }
      return html;
   }

   getStringContentFrom(val: any): string {
      if (typeof val === "string") return `"${val}"`;
      if (typeof val === "number") return val.toString();
      if (typeof val === "boolean") return val ? "true" : "false";
      if (val instanceof Set) {
         const items = [...val.values()]
            .map((item) => this.getStringContentFrom(item))
            .join();
         return `Set(${val.size}) [${items}]`;
      }

      if (val instanceof Map) {
         const items = [...val.entries()]
            .map(
               (item) =>
                  `${this.getStringContentFrom(
                     item[0]
                  )}: ${this.getStringContentFrom(item[1])}`
            )
            .join();
         return `Map(${val.size}) {${items}}`;
      }

      return JSON.stringify(val);
   }
}
