import dayjs, {Dayjs} from "dayjs";
import {v4 as uuid} from "uuid";

export type Conference = {
  id: string
  name: string
  url: string | null
  started_at: Dayjs | null
  ended_at: Dayjs | null
  logo_image_url: string | null
}

const PREFIX = 'conferences';

export type SearchCondition = {
  name: string | undefined
  started_at: Dayjs | undefined
}
export const getConferences = async (kv: KVNamespace, condition: SearchCondition) => {
  const list = await kv.list({
    prefix: PREFIX
  });

  const conferences: Conference[] = [];

  for (const k of list.keys) {
    const v = await kv.get<Conference>(k.name, 'json');
    if (v) {
      conferences.push(v);
    }
  }

  return conferences.filter((c) => {
    if (condition.name) {
      return c.name.toUpperCase().includes(condition.name.toUpperCase());
    }

    return true;
  }).filter((c) => {
    if (condition.started_at) {
      return dayjs(c.started_at).isSameOrAfter(dayjs(condition.started_at));
    }

    return true;
  });
}

export const getConference = async (kv: KVNamespace, id: string) => {
  return await kv.get<Conference>(key(id), 'json');
}

export const saveConference = async (kv: KVNamespace, conference: Conference) => {
  let c: Conference | null;

  if (conference.id !== undefined) {
    c = await kv.get<Conference>(key(conference.id), 'json');
    if (c === null) {
      throw new Error('Conference not exist.');
    }
    c.name = conference.name
    c.url = conference.url
    c.started_at = conference.started_at
    c.ended_at = conference.ended_at
    c.logo_image_url = conference.logo_image_url
  } else {
    c = conference
    c.id = uuid();
  }

  await kv.put(key(c.id), JSON.stringify(conference));
}

export const deleteConference = async (kv: KVNamespace, id: string) => {
  await kv.delete(key(id));
}

const key = (conferenceKey: string) => {
  return `${PREFIX}-${conferenceKey}`;
}

