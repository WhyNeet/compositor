import { ContainerEvents } from "./container-events";
import { ContainerEvent, EventListener } from "./event";

export class EventSubscriber {
  private _events: ContainerEvents;

  constructor(events: ContainerEvents) {
    this._events = events;
  }

  public subscribe(type: ContainerEvent, listener: EventListener) {
    this._events.subscribe(type, listener);
  }

  public unsubscribe(type: ContainerEvent, listener: EventListener) {
    this._events.unsubscribe(type, listener);
  }
}
