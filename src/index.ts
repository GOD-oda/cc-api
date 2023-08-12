import {Context, Hono} from 'hono';
import { zValidator } from '@hono/zod-validator'
import {z} from "zod";
import {createConference, getConference, getConferences} from "./app/conference";
import {bearerAuth} from "hono/bearer-auth";

type Bindings = {
  CONFERENCES: KVNamespace;
  TOKEN: string;
}
const app = new Hono<{Bindings: Bindings}>();

const api = app.basePath('/api');
api.get('/conferences', async (c) => {
  const conferences = await getConferences(c.env.CONFERENCES);

  return c.json(conferences);
});

api.get('/conferences/:key', async (c) => {
  const conf = await getConference(c.env.CONFERENCES, c.req.param('key'));

  if (conf) {
    return c.json(conf);
  } else {
    return c.notFound();
  }
});

const schema = z.object({
  key: z.string().regex(/^[a-zA-Z0-9\-_]+$/),
  name: z.string(),
  url: z.string().nullish(),
  started_at: z.string().datetime({offset: true}).nullish(),
  ended_at: z.string().datetime({offset: true}).nullish(),
  logo_image_url: z.string().nullish()
});
const zv = zValidator('json', schema, (result, c) => {
  if (!result) {
    return c.json(
      {},
      400
    );
  }
});

const bearer = async (c, next) => {
  const auth = bearerAuth({ token: c.env.TOKEN });

  return auth(c, next);
}

api.post('/conferences', bearer, zv, async (c) => {
  const json = c.req.valid('json');

  try {
    await createConference(c.env.CONFERENCES, json);
  } catch (e) {
    return c.json({msg: e.message}, 500);
  }

  return c.json({msg: 'success'}, 200);
});

export default app
