import { writable } from "svelte/store";
import { User } from "../entities/user";

const globalUser = writable<User>(new User({}));

export default globalUser;
