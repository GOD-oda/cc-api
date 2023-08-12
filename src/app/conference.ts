import {Dayjs} from "dayjs";

export type Conference = {
  key: string
  name: string
  url: string | null
  started_at: Dayjs | null
  ended_at: Dayjs | null
  logo_image_url: string | null
}

const PREFIX = 'conferences';

export const getConferences = async (kv: KVNamespace) => {
  const list = await kv.list({
    prefix: PREFIX
  });

  const conferences: Conference[] = [];

  for (const k of list.keys) {
    console.log(k);
    const v = await kv.get<Conference>(k.name, 'json');
    if (v) {
      conferences.push(v);
    }
  }

  return conferences;
}

export const getConference = async (kv: KVNamespace, id: string) => {
  return await kv.get<Conference>(key(id), 'json');
}

export const saveConference = async (kv: KVNamespace, conference: Conference) => {
  await kv.put(key(conference.key), JSON.stringify(conference));
}

const key = (conferenceKey: string) => {
  return `${PREFIX}-${conferenceKey}`;
}

