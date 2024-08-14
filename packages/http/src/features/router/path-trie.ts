import { HandlerPath, HandlerPathEntity } from "@compositor/core";
import { PathToken, or, wildcard } from "../handler";
import { HttpHandler } from "./http-router";

export class PathTrie {
  private _root: PathTrieNode;

  constructor() {
    const root = new PathTrieNode();
    this._root = root;
  }

  public pathConstruct(
    path: HandlerPath,
    // null value must be provided when resolving a subpath
    handler: HttpHandler | null,
    current = 0,
  ): PathTrieNode | null {
    if (current === path.length) {
      if (handler) {
        const handlerNode = new PathTrieNode();
        handlerNode.setValue(handler);
        return handlerNode;
      }

      return null;
    }

    const segment = path[current];

    if (
      typeof segment === "string" ||
      (segment as HandlerPathEntity).token !== PathToken.Or
    ) {
      const pathNode = new PathTrieNode();
      pathNode.setValue(segment);
      // string segments can only have one child node
      const childNode = this.pathConstruct(path, handler, current + 1);
      if (childNode) pathNode.addChild(childNode);
      return pathNode;
    }

    // construct an Or segment
    const pathNode = new PathTrieNode();
    pathNode.setValue(segment);
    const childSegments = (segment as ReturnType<typeof or>)
      .data as HandlerPath[];
    // construct child paths, treating each path as new
    const childNodes = childSegments.map((path) =>
      this.pathConstruct(path, null),
    );
    // iterate through the array of child nodes of an Or segment
    // append nodes to the child nodes array
    for (const node of childNodes) if (node) pathNode.addChild(node);
    return pathNode;
  }
}

export class PathTrieNode {
  private _children: PathTrieNode[] = [];
  private _value: string | HandlerPathEntity | HttpHandler;

  public setValue(value: string | HandlerPathEntity | HttpHandler) {
    this._value = value;
  }

  public value() {
    return this._value;
  }

  public equal(other: string | HandlerPathEntity | HttpHandler) {
    switch (typeof other) {
      case "string":
        return this._value === other;
      case "function":
        return false;
      default:
        return (this._value as HandlerPathEntity).token === other.token;
    }
  }

  public addChild(node: PathTrieNode) {
    this._children.push(node);
  }

  public replaceChild(idx: number, node: PathTrieNode): PathTrieNode {
    const current = this._value[idx];

    this._value[idx] = node;

    return current;
  }

  public getChildren() {
    return this._children;
  }
}
