// types/express/index.d.ts
import 'express';

declare module 'express-serve-static-core' {
  interface Response {
    success<T>(message: string, data?: T | null): this;
    failure(message: string, errorCode: number, error?: string | null): this;
  }
}
