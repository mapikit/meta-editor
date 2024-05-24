// eslint-disable-next-line max-classes-per-file
import { Writable, get, writable } from "svelte/store";

type NotificationTypes = "warn" | "info" | "error" | "debug";

class NotificationAction {
  public constructor (
    public call : () => void,
    public text : string,
  ) {}
}

class NotificationData {
  public buttonActions : NotificationAction[] = [];
  // eslint-disable-next-line max-params
  public constructor (
    public type : NotificationTypes,
    public title : string,
    public description : string,
    public durationMs ?: number,
  ) {}
}

class NotificationCenter {
  public dismissedAt : Writable<Date> = writable(new Date(Date.now()));
  public currentlyVisibleNotifications : Writable<NotificationData[]> = writable([]);
  public pendingNotifications : Writable<NotificationData[]> = writable([]);
  public dismissedNotifications : Writable<NotificationData[]> = writable([]);

  public dismissAll () : void {
    this.dismissedAt.set(new Date(Date.now()));
    const currentPending = get(this.pendingNotifications);
    this.pendingNotifications.set([]);
    this.dismissedNotifications.update((current) => current.concat(currentPending));
  }

  public clearAll () : void {
    this.dismissedAt.set(new Date(Date.now()));
    this.pendingNotifications.set([]);
    this.dismissedNotifications.set([]);
  }

  public notify (notification : NotificationData) : void {
    this.currentlyVisibleNotifications.update(current => current.concat([notification]));
  }
}

export const notificationManager = new NotificationCenter();
