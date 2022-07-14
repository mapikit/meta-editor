import type { Unsubscriber, Writable } from "svelte/store";
import assert from "node:assert";
import clone from "just-clone";

interface HistoryParameters <T>{
  storeToWatch : Writable<T>;
  maxHistorySize ?: number;
  minUpdateDelay ?: number;
  validatingFunction ?: (savedItem : T) => T;
}

export class History<T extends Record<string, unknown> | Array<unknown>> {
  private history : Array<T> = [];
  private currentPos = 0;
  private maxHistorySize : number;
  private validatingFunction : (savedItem : T) => T;
  private storeToWatch : Writable<T>;

  public unsubscribe : Unsubscriber;

  private blockUpdate = false;
  private delayedSave : NodeJS.Timeout = undefined;

  constructor (parameters : HistoryParameters<T>) {
    const noValidationRequired = (value : T) : T => value;
    const saveDelay = parameters.minUpdateDelay ?? 1500;

    this.storeToWatch = parameters.storeToWatch;
    this.maxHistorySize = parameters.maxHistorySize ?? 30;
    this.validatingFunction = parameters.validatingFunction ?? noValidationRequired;

    this.unsubscribe = parameters.storeToWatch.subscribe(value => {
      if(this.blockUpdate) return;
      if(this.delayedSave !== undefined) clearTimeout(this.delayedSave);
      this.delayedSave = setTimeout(() => {
        try { assert.deepEqual(this.history[0], value); }
        catch { this.addToHistory(value); }
      }, saveDelay);
    });
  };

  private addToHistory (value : T) : void {
    this.history = this.history.slice(this.currentPos);
    this.currentPos = 0;
    this.history.unshift(clone(value));
    if(this.history.length > this.maxHistorySize) this.history.pop();
    this.delayedSave = undefined;
  }

  public undo () : void {
    if(this.currentPos + 1 < this.history.length) this.currentPos++;
    this.blockUpdate = true;
    this.storeToWatch.set(this.validatingFunction(this.history[this.currentPos]));
    this.blockUpdate = false;
  }

  public redo () : void {
    if(this.currentPos - 1 >= 0) this.currentPos--;
    this.blockUpdate = true;
    this.storeToWatch.set(this.validatingFunction(this.history[this.currentPos]));
    this.blockUpdate = false;
  }

  private printState () : void {
    let stateBar = "NEW [";
    for(let i = 0; i < this.history.length; i++) stateBar += i === this.currentPos ? "V" : "-";
    console.log(stateBar + "] OLD");
  }
};
