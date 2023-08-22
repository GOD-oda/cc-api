import {Hono} from 'hono';
import { zValidator } from '@hono/zod-validator'
import {z} from "zod";
import {saveConference, getConference, getConferences, Conference, deleteConference} from "./app/conference";
import {bearerAuth} from "hono/bearer-auth";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrAfter);

type Bindings = {
  CONFERENCES: KVNamespace;
  TOKEN: string;
}
const app = new Hono<{Bindings: Bindings}>();

const api = app.basePath('/api');
const searchSchema = z.object({
  started_at: z.string().datetime({offset: true}).optional(),
  name: z.string().optional()
});
const searchZv = zValidator('query', searchSchema, (result, c) => {
  if (!result) {
    return c.json(
      {},
      400
    );
  }
});
api.get('/conferences', searchZv, async (c) => {
  const query = c.req.valid('query');
  const conferences = await getConferences(c.env.CONFERENCES, {
    name: query.name,
    started_at: dayjs(query.started_at)
  });

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
  const json = c.req.valid<Conference>('json');

  try {
    await saveConference(c.env.CONFERENCES, json);
  } catch (e) {
    return c.json({msg: e.message}, 500);
  }

  return c.json({msg: 'success'}, 200);
});

api.put('/conferences/:id', bearer, zv, async (c) => {
  const json = c.req.valid<Conference>('json');
  json.id = c.req.param('id');

  try {
    await saveConference(c.env.CONFERENCES, json);
  } catch (e) {
    return c.json({msg: e.message}, 500);
  }

  return c.json({msg: 'success'}, 200);
});

api.delete('/conferences/:id', bearer, async (c) => {
  try {
    await deleteConference(c.env.CONFERENCES, c.req.param('id'));
  } catch (e) {
    return c.json({msg: e.message}, 500);
  }

  return c.json({msg: 'success'}, 200);
});

export default app
