import { get } from "svelte/store";
import { DropPosition, SubdivisionStore, exported } from "../stores/dock-subdivision-store";

export class DockMutations {
  public static setParent (child : SubdivisionStore, parent : SubdivisionStore) : void {
    child.parent.set(parent);
    child.depth.set(get(parent.depth) + 1);
  }

  public static unsetParent (child : SubdivisionStore, parent :  SubdivisionStore) : void {
    const foundChild = parent.getChildById(child._id);

    if (!foundChild) { return; }
    foundChild.parent.set(null);
  }

  // eslint-disable-next-line max-params
  public static resize (
    subdiv : SubdivisionStore,
    firstElmId : string,
    secondElmId : string,
    sizeDeltaPx : number,
  ) : void {
    subdiv.refreshDimension();
    const absoluteValue = subdiv.dimensionValue;

    // The first element is the frame of reference for this operation
    // Meaning a negative delta is shrinking the first
    const first = subdiv.getChildById(firstElmId);
    const second = subdiv.getChildById(secondElmId);

    const sizeDeltaAbsolute = Number((sizeDeltaPx / absoluteValue).toFixed(6));

    first.ratio.update((current) => Number((current + sizeDeltaAbsolute).toFixed(6)));
    second.ratio.update((current) => Number((current - sizeDeltaAbsolute).toFixed(6)));
  }

  public static exclude (subdiv : SubdivisionStore, targetId : string, skipCleanup ?: boolean) : void {
    subdiv.children.update((current) => {
      const index = current.findIndex((child) => child._id === targetId);
      const childToBeDeleted = current[index];
      const modifiedIndex = index === current.length - 1 ? index - 1 : index + 1;

      current[modifiedIndex].ratio.update((value) => Number((value + get(current[index].ratio)).toFixed(6)));

      DockMutations.unsetParent(childToBeDeleted, subdiv);
      return current.filter((child) => child._id !== targetId);
    });

    if (!skipCleanup) DockMutations.cleanup();
  }

  // eslint-disable-next-line max-lines-per-function
  public static divide (subdiv : SubdivisionStore, currentId ?: string) : void {
    const isRoot = subdiv === null; // Root's parent is null
    let usedParent = subdiv;

    if (isRoot) {
      usedParent = exported.mainSubdivisionStore;
    }

    const newChild = new SubdivisionStore({ parent: usedParent });
    let usedRatio = 0;
    const currentElement = isRoot ? usedParent : usedParent.getChildById(currentId);

    currentElement.ratio.update((currentRatio) => {
      usedRatio = Number((currentRatio / 2).toFixed(6));
      return usedRatio;
    });

    newChild.ratio.set(usedRatio);

    let addedNextId = currentId;
    if (isRoot) {
      const beforeChild =  new SubdivisionStore({ parent: usedParent });
      beforeChild.view.set(get(usedParent.view));
      beforeChild.ratio.set(usedRatio);
      DockMutations.appendChild(usedParent, beforeChild);

      addedNextId = beforeChild._id;
    }

    DockMutations.appendChild(usedParent, newChild, addedNextId);
  }

  public static appendChild (parent : SubdivisionStore, child : SubdivisionStore, afterId ?: string) : void {
    parent.children.update((current) => {
      if (!afterId) {
        const targetIndex = current.length;
        child.index.set(targetIndex);
        current.push(child);
        return current;
      }

      const index = current.findIndex((sub) => sub._id === afterId);

      child.index.set(index + 1);
      return [].concat(current.slice(0, index + 1), child, current.slice(index + 1));
    });

    DockMutations.setParent(child, parent);
    DockMutations.fixHierarchy(parent);
  }

  public static prependChild (parent : SubdivisionStore, child : SubdivisionStore, beforeId ?: string) : void {
    parent.children.update((current) => {
      if (!beforeId) {
        const targetIndex = current.length;
        child.index.set(targetIndex);
        current.push(child);
        return current;
      }

      const index = current.findIndex((sub) => sub._id === beforeId);

      child.index.set(index - 1);
      return [].concat(current.slice(0, index), child, current.slice(index));
    });

    DockMutations.setParent(child, parent);
    DockMutations.fixHierarchy(parent);
  }

  public static fixHierarchy (subdiv ?: SubdivisionStore) : void {
    const targetSubdiv = subdiv ?? exported.mainSubdivisionStore;

    get(targetSubdiv.children).forEach((c, i) => {
      c.index.set(i);
      c.depth.set(get(targetSubdiv.depth) + 1);
      c.parent.set(targetSubdiv);
      if (c.childCount === 0 && c._id !== exported.mainSubdivisionStore._id) c.direction.set(null);
      DockMutations.fixHierarchy(c);
    });
  }

  public static findParent (childId : string) : SubdivisionStore {
    return this.flattenAllSubdivs().find((subdiv) => subdiv.getChildById(childId) !== undefined);
  }

  public static flattenAllSubdivs () : SubdivisionStore[] {
    const allSubdivs : SubdivisionStore[] = [];
    const pushChildren = (subdiv : SubdivisionStore) : void => {
      allSubdivs.push(subdiv);
      get(subdiv.children).forEach(c => {
        pushChildren(c);
      });
    };

    pushChildren(exported.mainSubdivisionStore);

    return allSubdivs;
  }

  // eslint-disable-next-line max-lines-per-function
  public static dropBetween (
    subdivision : SubdivisionStore,
    positions : { previousId ?: string, afterId ?: string, },
  ) : void {
    if (subdivision._id === positions.previousId || subdivision._id === positions.afterId) return;

    const parent = DockMutations.findParent(positions.previousId ?? positions.afterId);

    // Fixing the ratios:
    const previous = parent.getChildById(positions.previousId);
    const after = parent.getChildById(positions.afterId);

    const usedRatio = (previous && after) ? 3 : 2;
    const usedMultiplier = (previous && after) ? 2 : 1;
    let totalNewRatio = 0;
    const ratioUpdateFunc = (oldRatio) : number => {
      totalNewRatio += Number((oldRatio / usedRatio).toFixed(6));

      return Number((oldRatio / usedRatio).toFixed(6)) * usedMultiplier;
    };

    if (previous) previous.ratio.update(ratioUpdateFunc);
    if (after) after.ratio.update(ratioUpdateFunc);

    DockMutations.exclude(get(subdivision.parent), subdivision._id, true);
    subdivision.ratio.set(totalNewRatio);
    // Fetches new parent because it may have changed due to .cleanup();
    const newParent = previous ? get(previous.parent) : get(after.parent);
    if (previous) {
      DockMutations.appendChild(newParent, subdivision, positions.previousId);
      DockMutations.cleanup();
      return;
    }

    DockMutations.prependChild(newParent, subdivision, positions.afterId);
    DockMutations.cleanup();
  }

  // eslint-disable-next-line max-lines-per-function
  public static dropOnPosition (dropped : SubdivisionStore, position : DropPosition, target : SubdivisionStore) : void {
    if (target._id === dropped._id) { return; }

    const currentDirection = get(target.direction);

    const appending = target.childCount >= 2 && (
      (position === "right" && currentDirection === "horizontal")
      || (position === "bottom" && currentDirection === "vertical")
    );
    const prepending = target.childCount >= 2 && (
      (position === "left" && currentDirection === "horizontal")
      || (position === "top" && currentDirection === "vertical")
    );

    const droppingTangent = !appending && !prepending;

    if (droppingTangent) {
      // eslint-disable-next-line max-lines-per-function
      const handleDropTangent = () : void => {
        DockMutations.exclude(get(dropped.parent), dropped._id, true);
        let parent = get(target.parent);
        if (!parent) { // Is on the root subdiv
          parent = new SubdivisionStore({ parent: target });
          const targetDirection = ["right", "left"].includes(position) ? "horizontal" : "vertical";
          parent.children.set(get(target.children));
          parent.direction.set(get(target.direction));
          parent.ratio.set(0.7);
          target.direction.set(targetDirection);
          dropped.ratio.set(0.3);
          target.children.update(() => {
            const tangentBefore = ["left", "top"].includes(position);

            return tangentBefore ? [dropped, parent] : [parent, dropped];
          });

          DockMutations.cleanup();
          return;
        }
        const newParent = new SubdivisionStore({ parent });
        if (parent) DockMutations.unsetParent(target, parent);
        DockMutations.setParent(target, newParent);
        parent.children.update((current) => {
          const currentIndex = parent.getChildIndexById(target._id);
          current[currentIndex] = newParent;

          return current;
        });

        newParent.ratio.set(get(target.ratio));
        newParent.direction.set(get(parent.direction) === "horizontal" ? "vertical" : "horizontal");
        dropped.ratio.set(0.5);
        target.ratio.set(0.5);
        newParent.children.update(() => {
          const tangentBefore = ["left", "top"].includes(position);

          return tangentBefore ? [dropped, target] : [target, dropped];
        });

        DockMutations.cleanup();
        return;
      };

      return handleDropTangent();
    }

    if (appending) {
      DockMutations.dropBetween(dropped, { previousId: target.getLastChild()._id });
      return;
    }

    console.log("DROPPING PREPENDING!");
    DockMutations.dropBetween(dropped, { afterId: target.getFirstChild()._id });
  }

  // eslint-disable-next-line max-lines-per-function
  public static cleanup (workingElement ?: SubdivisionStore) : void {
    DockMutations.fixHierarchy();
    DockMutations.debug();
    if (!workingElement) {
      DockMutations.cleanup(exported.mainSubdivisionStore);
      return;
    }

    if (workingElement.childCount >= 2) {
      const currentChildren = get(workingElement.children);
      currentChildren.forEach(child => DockMutations.cleanup(child));
      // Flatten by bringing up children with the same orientation as parents

      const toBeFlattened = currentChildren.filter((c) => get(c.direction) === get(workingElement.direction));

      toBeFlattened.forEach((child) => {
        const count = child.childCount;
        const finalChildrenRatio = Number((get(child.ratio) / count).toFixed(6));
        get(child.children).forEach((cc) => {
          cc.ratio.set(finalChildrenRatio);
          cc.parent.set(workingElement);
        });

        workingElement.children.update((current) => {
          const index = get(child.index);
          return [].concat(current.slice(0, index), get(child.children), current.slice(index + 1));
        });

        DockMutations.unsetParent(child, workingElement);
      });

      DockMutations.fixHierarchy();
      return;
    }

    // Subdivisions MUST NOT have only another subdiv as their child (childCount == 1)
    // It is either Many subdivs, or it is a view.

    const workingParent = get(workingElement.parent);

    if (workingElement.childCount === 1) {
      // Find deepest child that either has many childs or is view
      let deepestValidChild = get(workingElement.children)[0];

      while (deepestValidChild.childCount === 1) {
        deepestValidChild = get(deepestValidChild.children)[0];
      }

      if (!workingParent) {
        // This is cleaning up to the root element
        // Just copy the childs value to itself and unreference the child;
        DockMutations.unsetParent(deepestValidChild, get(deepestValidChild.parent));

        const newRatio = get(deepestValidChild.ratio);
        const newDirection = get(deepestValidChild.direction);
        workingElement.ratio.set(newRatio);
        workingElement.direction.set(newDirection ?? get(workingElement.direction)); // could be null
        workingElement.children.set(get(deepestValidChild.children));
        get(deepestValidChild.children).forEach((c) => {
          DockMutations.setParent(c, workingElement);
        });

        DockMutations.fixHierarchy();
        return;
      }

      DockMutations.unsetParent(workingElement, workingParent);
      DockMutations.setParent(deepestValidChild, workingParent);
      workingParent.children.update((children) => {
        children[get(workingElement.index)] = deepestValidChild;
        return children;
      });

      const newRatio = get(workingElement.ratio);
      const newDirection = get(deepestValidChild.direction);
      deepestValidChild.ratio.set(newRatio);
      deepestValidChild.direction.set(newDirection);
    }

    DockMutations.fixHierarchy();
  }

  public static debug () : void {
    const initMessage = "Debugging Subdivisions\n";
    const appended : string[] = [];
    this.flattenAllSubdivs().forEach((sd) => { appended.push(sd.debug()); });
    console.log(initMessage + appended.join(""));
  }
}
