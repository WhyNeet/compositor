export type EventListener<Data> = (data: Data) => void;
export interface Event<Type, Payload> {
  type: Type;
  payload: Payload;
}
