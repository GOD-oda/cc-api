import { Hono } from 'hono';

type Bindings = {
  CONFERENCES: KVNamespace;
}
const app = new Hono<{Bindings: Bindings}>();


app.get('/api', async (c) => {
  const foo = await c.env.CONFERENCES.get('foo');
  return c.json({foo: foo});
});

export default app
