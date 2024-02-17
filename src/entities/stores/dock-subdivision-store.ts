/* eslint-disable max-classes-per-file */
// Contains many classes for holding Dock Data

import { nanoid } from "nanoid";
import { Readable, Writable, derived, get, readable, writable } from "svelte/store";
import { DockMutations } from "../mutations/dock-mutations";
import { ViewStore } from "./view-store";
import { EditorEntityValue } from "src/entities/models/editor-entity-value";

type DropAreaRules = {
  "showTopDropArea" : Readable<boolean>
  "showBottomDropArea" : Readable<boolean>
  "showLeftDropArea" : Readable<boolean>
  "showRightDropArea" : Readable<boolean>
};

export type DropPosition = "top" | "bottom" | "left" | "right";

export class SubdivisionStore {
  public readonly _id = nanoid();
  public readonly ratio : Writable<number> = writable(1);
  public readonly children : Writable<SubdivisionStore[]> = writable([]);
  public readonly view : Writable<ViewStore<EditorEntityValue>> = writable(null);
  public readonly direction : Writable<"horizontal" | "vertical" | null> = writable(null);
  public readonly parent : Writable<SubdivisionStore | null> = writable(null);
  public readonly dimension : Writable<number> = writable(0);
  public readonly HTMLElement : Writable<HTMLElement | null> = writable(null);
  public readonly index : Writable<number> = writable(0);
  public depth : Writable<number> = writable(0);
  public booted = false;

  public toString () : string {
    return `Id: ${this._id}, childrenCount: ${this.childCount}`;
  }

  // eslint-disable-next-line max-lines-per-function
  public constructor (opts : { parent ?: SubdivisionStore }) {
    if (opts.parent) DockMutations.setParent(this, opts.parent);

    this.view.set(new ViewStore("", { identifier: this._id }));
  }

  public getFirstAndLastObservables () : { isFirst : Readable<boolean>, isLast : Readable<boolean> } {
    return {
      isFirst: get(this.parent) ?
        derived([this.index], ([index]) => {
          return index === 0;
        }) : readable(true),

      isLast: get(this.parent) ?
        derived([get(this.parent).children, this.index], ([siblings, index]) => {
          return index + 1 === siblings?.length;
        }) : readable(true),
    };
  }

  // eslint-disable-next-line max-lines-per-function
  public getDropAreaRules () : DropAreaRules {
    const observables = this.getFirstAndLastObservables();
    const isFirst = observables.isFirst;
    const isLast = observables.isLast;

    const result : DropAreaRules = {
      showTopDropArea: get(this.parent) ?
        derived([isFirst, get(this.parent).direction, this.index],
          ([first, thisParentDirection, currentIndex]) => {
            const firstVertical = first && thisParentDirection === "vertical";
            const hasSiblingBefore = (currentIndex > 0) && thisParentDirection === "vertical";

            const denyRules = [firstVertical, hasSiblingBefore];

            return denyRules.every(v => v === false);
          }) : readable(true),

      showBottomDropArea: get(this.parent) ?
        derived([isLast, get(this.parent).direction, this.index],
          ([last, thisParentDirection, currentIndex]) => {
            const lastVertical = last && thisParentDirection === "vertical";
            const hasSiblingAfter = (currentIndex < get(this.parent)?.childCount - 1)
            && thisParentDirection === "vertical";

            const denyRules = [lastVertical, hasSiblingAfter];

            return denyRules.every(v => v === false);
          }) : readable(true),

      showLeftDropArea: get(this.parent) ?
        derived([isFirst, get(this.parent).direction, this.index],
          ([first, thisParentDirection, currentIndex]) => {
            const firstHorizontal = first && thisParentDirection === "horizontal";
            const hasSiblingBefore = (currentIndex > 0) && thisParentDirection === "horizontal";

            const denyRules = [firstHorizontal, hasSiblingBefore];

            return denyRules.every(v => v === false);
          }) : readable(true),

      showRightDropArea: get(this.parent) ?
        derived([isLast, get(this.parent).direction, this.index],
          ([last, thisParentDirection, currentIndex]) => {
            const lastHorizontal = last && thisParentDirection === "horizontal";
            const hasSiblingAfter = (currentIndex < get(this.parent)?.childCount - 1)
              && thisParentDirection === "horizontal";

            const denyRules = [lastHorizontal, hasSiblingAfter];

            return denyRules.every(v => v === false);
          }) : readable(true),
    };

    return result;
  }

  public setElement (element : HTMLElement) : void {
    if (!element) return;
    this.HTMLElement.set(element);
    this.refreshDimension();
  }

  public refreshDimension () : void {
    const sizeAxis = get(this.direction) === "horizontal" ? "width" : "height";
    this.dimension.set(get(this.HTMLElement).getBoundingClientRect()[sizeAxis]);
  }

  public get dimensionValue () : number {
    return get(this.dimension);
  }

  public getChildById (id : string) : SubdivisionStore {
    return get(this.children).find(sd => sd._id === id);
  }

  public getChildIndexById (id : string) : number {
    return get(this.children).findIndex(sd => sd._id === id);
  }

  public getLastChild () : SubdivisionStore {
    const currentChildren = get(this.children);
    return currentChildren[currentChildren.length - 1];
  }

  public getFirstChild () : SubdivisionStore {
    const currentChildren = get(this.children);
    return currentChildren[0];
  }

  public get childCount () : number {
    return get(this.children).length;
  }

  private addDepthPaddingLine (text : string) : string {
    return ("  ".repeat(get(this.depth))) + text + "\n";
  }

  public debug () : string {
    let value = "";
    value += this.addDepthPaddingLine(this._id + " --> " + get(this.parent)?._id);
    value += this.addDepthPaddingLine(`ratio: ${get(this.ratio)}`);
    value += this.addDepthPaddingLine(`index: ${get(this.index)}`);
    value += this.addDepthPaddingLine(`direction: ${get(this.direction)}`);
    value += this.addDepthPaddingLine(`Child Count: ${this.childCount}`);

    return value;
  }
}

// EXPORTED GLOBALS

export const exported = {
  mainSubdivisionStore : new SubdivisionStore({}),
};

window["homeDock"] = exported.mainSubdivisionStore;
window["getter"] = get;
