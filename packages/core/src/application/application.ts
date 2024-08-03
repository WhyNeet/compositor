import { Container, Ctor } from "../ioc";
import { ApplicationContext } from "./context";

export class Application {
  private _context: ApplicationContext;
  private _root: Ctor;

  constructor(root: Ctor) {
    this._root = root;
  }

  public run() {
    const container = new Container();
    const context = new ApplicationContext(container);
    this._context.root(this._root);
    this._context = context;
  }
}
