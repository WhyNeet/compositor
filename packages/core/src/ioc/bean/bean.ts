// TODO: implement a Bean class that holds a factory and an instance

// import { Ctor } from "./types";

// export class Bean<T extends Ctor> {
//   private _factory: () => InstanceType<T>;
//   private _instance: InstanceType<T> | null = null;
//   private _lazy: boolean;

//   constructor(factory: () => InstanceType<T>, props?: BeanProperties) {
//     this._factory = factory;
//     this._lazy = props?.lazy ?? false;

//     if (!this._lazy) this.instantiate();
//   }

//   public getInstance(): InstanceType<T> {
//     if (this._lazy)
//       return new Proxy(
//         {},
//         {
//           get: (target, prop, recv) => {
//             if (!this._instance) this.instantiate();
//             // biome-ignore lint/complexity/noBannedTypes: must be an object
//             return Reflect.get(this._instance as Object, prop, recv);
//           },
//         },
//       ) as InstanceType<T>;
//     // biome-ignore lint/style/noNonNullAssertion: cannot be null here
//     return this._instance!;
//   }

//   private instantiate() {
//     this._instance = this._factory();
//   }
// }

// // biome-ignore lint/suspicious/noExplicitAny: must use any
// export type AnyBean = Bean<any>;
