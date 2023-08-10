import {Context} from "hono";

export const auth = (c: Context) => {
  const key = c.req.headers.get('x-token');
  if (key === null) {
    return false;
  }

  return key === c.env.TOKEN;
}