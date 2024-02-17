import { writable, Writable, readable, Readable } from "svelte/store";
import decode from "jwt-decode";

type UserConstructorArgument =
  { token ?: string }

export class User {
  public readonly refreshToken : Readable<string>;
  public readonly email : Writable<string> = writable("");

  public constructor ({  token } : UserConstructorArgument) {
    this.refreshToken = readable(token);
    const email = token ? decode(token)["email"] as string : "NO_USER";
    this.email.set(email);
  }
}
