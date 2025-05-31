export enum UnitGameEvent {
   Move,
   Damaged,
   Die,
}

export interface GameEvent {
   unit_id: string; // May need to change to entity_id in the future
   event: UnitGameEvent;
}
