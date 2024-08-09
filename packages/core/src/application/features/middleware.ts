export abstract class Middleware {
  abstract apply(
    req: unknown,
    res: unknown,
    next: (req: unknown, res: unknown) => void,
  ): void;
}
