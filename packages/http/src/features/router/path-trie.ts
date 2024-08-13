import { HandlerPath, HandlerPathEntity } from "@compositor/core";
import { PathToken, wildcard } from "../handler";
import { HttpHandler } from "./http-router";

export class PathTrie {
  private _root: PathTrieNode;

  constructor() {
    const root = new PathTrieNode();
    root.setValue(wildcard());
    this._root = root;
  }

  public addNode(path: HandlerPath, handler: HttpHandler) {
    const add = (segmentIdx: number, root: PathTrieNode) => {
      // the path is completely resolved, insert a handler in the current node
      if (segmentIdx === path.length - 1) {
        const handlerNode = new PathTrieNode();
        handlerNode.setValue(handler);
        root.addChild(handlerNode);
        return;
      }

      const segment = path[segmentIdx];

      switch (typeof root.value()) {
        case "string":
          // path segments can only have 1 child node
          if (root.getChildren().length === 0) {
            const newNode = new PathTrieNode();
            newNode.setValue(path[segmentIdx + 1]);
            root.addChild(newNode);
          }
          add(segmentIdx + 1, root.getChildren()[0]);
          break;
        case "function":
          break;
        case "object":
          switch ((root.value() as HandlerPathEntity).token) {
            case PathToken.Wildcard:
              // wildcard token can have multiple child nodes
              if (root.getChildren().length === 0) {
                const newNode = new PathTrieNode();
                newNode.setValue(segment);
                root.addChild(newNode);
              }
              add(
                segmentIdx,
                // search for the matching node
                root
                  .getChildren()
                  .find((node) => node.equal(segment)),
              );
          }
          break;
      }
    };

    add(0, this._root);
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

  public getChildren() {
    return this._children;
  }
}
