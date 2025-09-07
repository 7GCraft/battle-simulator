import Unit from "../Unit";

export default class UnitBuilder {
   static renderPrimary(unit: Unit) {
      unit.reset().drawPoly().fillColorStyle("primary").addText();
      return unit.graphic;
   }

   static renderActive(unit: Unit) {
      unit.reset().drawPoly().fillColorStyle("active").addText();
      return unit.graphic;
   }

   static renderDisabled(unit: Unit) {
      unit.reset().drawPoly().fillColorStyle("disabled").addText();
      return unit.graphic;
   }
}
