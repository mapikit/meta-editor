import { writable, Writable, readable, Readable } from "svelte/store";

type UserConstructorArgument =
  { id : string; email : string; }

export class User {
  public readonly id : Readable<string>;
  public readonly email : Writable<string> = writable("");

  public constructor ({ id, email } : UserConstructorArgument) {
    this.id = readable(id);
    this.email.set(email);
  }
}
