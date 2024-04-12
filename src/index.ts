import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';

const users = [
  {
    id: 1,
    username: 'byron',
  },
  {
    id: 2,
    username: 'courtney',
  },
  {
    id: 3,
    username: 'keeley',
  },
  {
    id: 4,
    username: 'elke',
  },
];

const app = new Hono();

app.use(logger());

app.use('*', serveStatic({ root: './static' }));

app.get('/', c => {
  return c.text('Hello Hono!');
});

app.get('/bye', c => {
  return c.text('Good-bye cruel world!');
});

// app.all('/api/*', async (ctx, next) => {
//   await next();

//   const data = await ctx.res.json();
//   const status = ctx.res.status;

//   ctx.res = new Response(
//     JSON.stringify({
//       status,
//       data,
//     }),
//   );
//   console.log('End Middleware');
// });

app.get('/api/users', c => {
  console.log('Start Handler');
  return c.json(users);
});

app.get('/api/users/:id', c => {
  const { id } = c.req.param();

  if (Number.isNaN(+id)) {
    throw new HTTPException(401, { message: 'ID must be a number value' });
  }

  return c.json(users.find(u => u.id == id));
});

app.get('*', c => {
  return c.text('Not Found', 404);
});

export default {
  port: 3000,
  fetch: app.fetch,
};
