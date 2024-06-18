// eslint-disable-next-line max-classes-per-file
import { nanoid } from "nanoid";
import { Readable, Writable, derived, get, writable } from "svelte/store";

type NotificationTypes = "warn" | "info" | "error" | "debug";
export enum NotificationLocation {
  STACK = "stack",
  PENDING = "pending",
  DISMISSED = "dismissed"
}

export class NotificationAction {
  public constructor (
    public call : () => void,
    public text : string,
    public type : NotificationTypes = "info",
  ) {}
}

export class NotificationData {
  public readonly identifier : string = nanoid();
  public buttonActions : NotificationAction[] = [];
  public readonly location : Writable<NotificationLocation> = writable(NotificationLocation.STACK);
  public readonly timestamp = new Date(Date.now());

  // eslint-disable-next-line max-params
  public constructor (
    public type : NotificationTypes,
    public title : string,
    public description : string,
    public silent ?: boolean,
    public durationMs ?: number,
  ) {
    if (silent) {
      this.location.set(NotificationLocation.PENDING);
    }
  }

  private timer : ReturnType<typeof setTimeout> = null;
  public ticking : Writable<boolean> = writable(false);
  public finished : Writable<boolean> = writable(false);

  private coyoteTime : number = 500;
  private coyoteTimer : ReturnType<typeof setTimeout> = null;
  public startTimer () : void {
    if (!this.durationMs || this.durationMs === 0) return;

    this.coyoteTimer = setTimeout(() => {
      this.ticking.set(true);
      this.timer = setTimeout(() => {
        this.finished.set(true);
        this.ticking.set(false);
        notificationManager.dismissToUnread(this);
      }, this.durationMs);
    }, this.coyoteTime);
  }

  public stop () : void {
    clearTimeout(this.timer);
    clearTimeout(this.coyoteTimer);
    this.ticking.set(false);
  }
}

class NotificationCenter {
  public currentlyVisibleNotifications : Writable<NotificationData[]> = writable([]);
  public pendingNotifications : Writable<NotificationData[]> = writable([]);
  public dismissedNotifications : Writable<NotificationData[]> = writable([]);
  public hasPending : Readable<boolean> = derived(this.pendingNotifications, (v) => v.length > 0);
  public muted : Writable<boolean> = writable(false);
  // TODO load value from User Preferences

  public constructor () {
    this.clearAll = this.clearAll.bind(this);
    this.dismissAll = this.dismissAll.bind(this);
  }


  public dismissAll () : void {
    const currentPending = get(this.pendingNotifications);
    this.pendingNotifications.set([]);
    currentPending.forEach((n) => n.location.set(NotificationLocation.DISMISSED));
    this.dismissedNotifications.update((current) => current.concat(currentPending));
  }

  public clearAll () : void {
    this.pendingNotifications.set([]);
    this.dismissedNotifications.set([]);
  }

  public clearOne (notification : NotificationData) : void {
    this.dismissedNotifications.update(current => current.filter((n) => n !== notification));
  }

  public notify (notification : NotificationData) : void {
    if (notification.silent) {
      this.pendingNotifications.update(current => current.concat([notification]));
      return;
    }

    this.currentlyVisibleNotifications.update(current => current.concat([notification]));
  }

  public dismissToUnread (notification : NotificationData) : void {
    this.currentlyVisibleNotifications.update(current =>
      current.filter((n) => n !== notification),
    );

    this.pendingNotifications.update(current => current.concat([notification]));
    notification.location.set(NotificationLocation.PENDING);
  }

  public dismissPending (notification : NotificationData) : void {
    this.pendingNotifications.update(current =>
      current.filter(n => n !== notification),
    );

    this.dismissedNotifications.update(current => current.concat([notification]));
    notification.location.set(NotificationLocation.DISMISSED);
  }

  public dismissVisible (notification : NotificationData) : void {
    this.currentlyVisibleNotifications.update(current =>
      current.filter((n) => n !== notification),
    );

    this.dismissedNotifications.update(current => current.concat([notification]));

    notification.location.set(NotificationLocation.DISMISSED);
  }
}

export const notificationManager = new NotificationCenter();
