import cursor from "../stores/cursor-store";

export class CursorMutations {
  static positionEventHandler (ev : MouseEvent) : void {
    cursor.position.set({ x: ev.clientX, y: ev.clientY });
  }
}
