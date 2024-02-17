import { DockMutations } from "../mutations/dock-mutations";
import { SubdivisionStore, exported } from "../stores/dock-subdivision-store";

export class DockController {
  // eslint-disable-next-line max-lines-per-function
  public static bootDefault () : void {
    if (exported.mainSubdivisionStore.booted) return;

    console.log("BOOTING DOCKING AREA");
    exported.mainSubdivisionStore.direction.set("vertical");
    const child1 = new SubdivisionStore({ parent: exported.mainSubdivisionStore });
    const child2 = new SubdivisionStore({ parent: exported.mainSubdivisionStore });

    child1.direction.set("horizontal");
    child2.direction.set("horizontal");

    const innerChild1 = new SubdivisionStore({ parent: child2 });
    const innerChild2 = new SubdivisionStore({ parent: child2 });

    child1.ratio.set(.8);
    child2.ratio.set(.2);

    innerChild1.ratio.set(0.4);
    innerChild2.ratio.set(0.6);

    DockMutations.appendChild(child2, innerChild1);
    DockMutations.appendChild(child2, innerChild2);

    DockMutations.appendChild(exported.mainSubdivisionStore, child1);
    DockMutations.appendChild(exported.mainSubdivisionStore, child2);

    exported.mainSubdivisionStore.booted = true;
  }
}
