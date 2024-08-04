import { ContainerEvent, EventData, EventListener } from "./event";

export class ContainerEvents {
  private _listeners: Map<ContainerEvent, EventListener[]>;

  constructor() {
    this._listeners = new Map();
  }

  public subscribe(type: ContainerEvent, listener: EventListener) {
    if (this._listeners.has(type)) this._listeners.get(type).push(listener);
    else this._listeners.set(type, [listener]);
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
    for (const listener of this._listeners.get(data.type)) listener(data);
  }
}
