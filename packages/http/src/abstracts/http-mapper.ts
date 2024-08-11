export abstract class HttpMapper<From, To> {
  abstract map(from: From): To;
  abstract mapback(from: To): From;
}
