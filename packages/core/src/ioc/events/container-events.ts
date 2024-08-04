import { ContainerEvent, EventData, EventListener } from "./event";

export class ContainerEvents {
  private _listeners: Map<ContainerEvent, EventListener[]>;
  private _events: EventData[];

  constructor() {
    this._listeners = new Map();
  }

  public subscribe(
    type: ContainerEvent,
    listener: EventListener,
    replay = true,
  ) {
    if (this._listeners.has(type)) this._listeners.get(type).push(listener);
    else this._listeners.set(type, [listener]);

    if (replay) for (const event of this._events) listener(event);
  }

  public unsubscribe(type: ContainerEvent, listener: EventListener) {
    if (!this._listeners.has(type))
      throw new Error(`No listeners are attached to "${type}" event`);
    const arr = this._listeners.get(type);
    this._listeners.set(
      type,
      arr.filter((func) => func !== listener),
    );
  }

  public emit(data: EventData) {
    if (!this._listeners.has(data.type)) return;
    this._events.push(data);
    for (const listener of this._listeners.get(data.type)) listener(data);
  }
}
