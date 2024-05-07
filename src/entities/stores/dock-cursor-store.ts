import { nanoid } from "nanoid";
import { DeafultDragContext } from "../../frontend/components/drag-n-drop/default-drag-context";

class DockCursorStore extends DeafultDragContext {
}

window["nanoid"] = nanoid;

export default new DockCursorStore();
