import { Container, Injectable, InjectionToken } from '@decorators/di';
import { Type } from '@decorators/di/lib/src/types';
import { Middleware } from '@decorators/express';
import multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads'),
  filename: (req, file, cb) =>
    cb(null, [Date.now(), file.originalname].join('_')),
});

export const uploader = multer({
  storage: storage,
});

export function UploadMiddleware(options: { fieldName: string }): Type {
  @Injectable()
  class UploadMiddlewareClass implements Middleware {
    use = uploader.single(options.fieldName);
  }

  Container.provide([
    {
      provide: new InjectionToken('UPLOAD_MIDDLEWARE'),
      useClass: UploadMiddlewareClass,
    },
  ]);

  return UploadMiddlewareClass;
}
