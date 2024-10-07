import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApiPrefixMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.url.startsWith('/api')) {
      const newUrl = `/api${req.url}`;
      return res.redirect(newUrl);
    }
    next();
  }
}
