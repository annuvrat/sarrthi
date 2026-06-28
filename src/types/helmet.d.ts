declare module 'helmet' {
  import type { RequestHandler } from 'express';

  type HelmetOptions = Record<string, unknown>;

  function helmet(options?: Readonly<HelmetOptions>): RequestHandler;

  export default helmet;
}
