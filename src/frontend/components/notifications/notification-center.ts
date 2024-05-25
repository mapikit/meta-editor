// eslint-disable-next-line max-classes-per-file
import { nanoid } from "nanoid";
import { Writable, get, writable } from "svelte/store";

type NotificationTypes = "warn" | "info" | "error" | "debug";

export class NotificationAction {
  public constructor (
    public call : () => void,
    public text : string,
  ) {}
}

export class NotificationData {
  public readonly identifier : string = nanoid();
  public buttonActions : NotificationAction[] = [];
  // eslint-disable-next-line max-params
  public constructor (
    public type : NotificationTypes,
    public title : string,
    public description : string,
    public durationMs ?: number,
  ) {}

  private timer : ReturnType<typeof setTimeout> = null;
  public ticking : Writable<boolean> = writable(false);
  public finished : Writable<boolean> = writable(false);

  private coyoteTime : number = 500;
  public startTimer () : void {
    if (!this.durationMs || this.durationMs === 0) return;

    setTimeout(() => {
      this.ticking.set(true);
    }, this.coyoteTime);

    this.timer = setTimeout(() => {
      notificationManager.dismiss(this);
      this.finished.set(true);
      this.ticking.set(false);
    }, this.durationMs + this.coyoteTime);
  }

  public stop () : void {
    clearTimeout(this.timer);
    this.ticking.set(false);
  }
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

  public dismiss (notification : NotificationData) : void {
    this.currentlyVisibleNotifications.update(current =>
      current.filter((n) => n !== notification),
    );

    this.dismissedNotifications.update(current => current.concat([notification]));
  }
}

export const notificationManager = new NotificationCenter();
