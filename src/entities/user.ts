import { localStorageService } from "../services/local-storage-service";
import { writable, Writable, readable, Readable, get } from "svelte/store";

type UserConstructorArgument =
  { id : string; email : string; }

export class User {
  public readonly id : Readable<string>;
  public readonly email : Writable<string> = writable("");

  public constructor ({ id, email } : UserConstructorArgument) {
    if (localStorageService.isInStorage("user")) {
      const data = localStorageService.fetchKey("user") as object;
      this.id = readable(data["id"]);
      this.email.set(data["email"]);

      this.keepStorageUpdated();
      return;
    }


    this.id = readable(id);
    this.email.set(email);
    this.keepStorageUpdated();
  }

  private keepStorageUpdated () : void {
    const saveFunction = () : void => {
      localStorageService.save("user", {
        id: get(this.id),
        email: get(this.email),
      });
    };

    this.email.subscribe(saveFunction);
    this.id.subscribe(saveFunction);
  }
}
