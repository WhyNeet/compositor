import { Event, EventListener } from "./event";
import { Events } from "./events";

export class EventSubscriber<EventType, EventData> {
  private _events: Events<EventType, EventData>;

  constructor(events: Events<EventType, EventData>) {
    this._events = events;
  }

  public subscribe(
    type: EventType,
    listener: EventListener<Event<EventType, EventData>>,
    replay = true,
  ) {
    this._events.subscribe(type, listener, replay);
  }

  public unsubscribe(
    type: EventType,
    listener: EventListener<Event<EventType, EventData>>,
  ) {
    this._events.unsubscribe(type, listener);
  }
}
