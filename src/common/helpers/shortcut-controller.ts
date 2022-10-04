type ModifierKeys = {
  ctrl ?: boolean;
  alt ?: boolean;
  shift ?: boolean;
};

export class ShortcutsController {
  private handlers : Map<string, () => void> = new Map();

  public constructor () {
    this.getShortcutEventHandler = this.getShortcutEventHandler.bind(this);
  }

  private trueOrZero (value ?: boolean) : number {
    return Number(value ?? 0);
  }

  public setShortcut (key : string, handler : () => void, modifiers ?: ModifierKeys) : void {
    let modifiersAdditionalString = "";
    if (modifiers) {
      // eslint-disable-next-line max-len
      modifiersAdditionalString = `+${this.trueOrZero(modifiers.ctrl)}+${this.trueOrZero(modifiers.alt)}+${this.trueOrZero(modifiers.shift)}`;
    }

    const modifiersBind = key + modifiersAdditionalString;
    this.handlers.set(modifiersBind, handler);
  }

  public clearShortcut (key : string, modifiers ?: ModifierKeys) : void {
    let modifiersAdditionalString = "";
    if (modifiers) {
      // eslint-disable-next-line max-len
      modifiersAdditionalString = `+${this.trueOrZero(modifiers.ctrl)}+${this.trueOrZero(modifiers.alt)}+${this.trueOrZero(modifiers.shift)}`;
    }

    const modifiersBind = key + modifiersAdditionalString;
    this.handlers.delete(modifiersBind);
  }

  public getShortcutEventHandler (event : KeyboardEvent) : void {
    if (!event.shiftKey && !event.altKey && !event.ctrlKey) {
      const handler = this.handlers.get(event.key);
      handler ? handler() : (() => {})();
      return;
    }

    // eslint-disable-next-line max-len
    const eventModifiersBind = `${event.key}+${Number(event.ctrlKey)}+${Number(event.altKey)}+${Number(event.shiftKey)}`;
    const handler = this.handlers.get(eventModifiersBind);
    handler ? handler() : (() => {})();
  }
};

