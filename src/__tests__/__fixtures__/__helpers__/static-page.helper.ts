import * as Koa from 'koa';
import * as serve from 'koa-static';
import * as path from 'path';

export const createTestStaticServer = async (baseDir: string, port: number) => {
  const app = new Koa();
  const staticPath = path.join(__dirname, '..', '__fixtures__', '__pages__', baseDir);

  app.use(serve(staticPath));
  return app.listen(port);
};

export const createTestErrorServer = async (port: number) => {
  const app = new Koa();
  app.use(async (ctx) => {
    ctx.response.status = 404;
  });

  return app.listen(port);
};

export const getTestURL = (port: number) => `http://127.0.0.1:${port}`;
