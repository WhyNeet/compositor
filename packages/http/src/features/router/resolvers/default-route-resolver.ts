import { HandlerPath, RawHandlerPath } from "@compositor/core";
import {
  HttpHandler,
  HttpRouteResolver,
  PathResolverMetadata,
  PathResolverOutputMetadata,
} from "../../../abstracts";
import { PathTrie } from "../path-trie";

export class DefaultRouteResolver implements HttpRouteResolver {
  private _trie: PathTrie;

  constructor() {
    this._trie = new PathTrie();
  }

  addRoute(path: HandlerPath, handler: HttpHandler): void {
    this._trie.addPath(path, handler);
  }

  resolve(
    path: RawHandlerPath,
    metadata: PathResolverMetadata,
  ): [HttpHandler, PathResolverOutputMetadata] {
    return this._trie.resolvePath(path, metadata);
  }
}
