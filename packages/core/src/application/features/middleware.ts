export abstract class Middleware {
  abstract apply(req: unknown, res: unknown, next: () => void): void;
}
