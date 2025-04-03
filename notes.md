Playground Roadmap

1. [x] Init project with boardgame.io & PIXI.js.
2. [x] Create the board with numbers.
3. [x] Add player and movement.
4. [x] Add multiplayer and win condition (technical back-end).
5. [ ] Add multiple units for each player.
6. [ ] Add icon
7. [ ] Represent powers into HP bar (?)
8. [ ] Push playground into main.

Multiple Units
Logic:
1. Select which unit to move
   1. Must be your own unit
   2. Must not do an action before
2. Mark the unit as selected in the client
3. Execute an action for the unit
   1. Move
   2. Fight
4. Mark the unit as "done" (already done an action)
5. Loop to (1) until all units have completed an action
6. End Turn, go to another player

Low Level Logic:
1. Select unit to move
   - Set unit ID to activeUnitID
2.
