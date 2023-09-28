// @ts-ignore
import * as fs from "fs";
// @ts-ignore
import * as process from "process";
import { parse } from 'node-html-parser';

try{
  const fileName = process.argv[2];
  if (fileName === undefined) {
    throw new Error(`Conference Name must be required.\nYou should run this command with -name option.\n\nnpm run create-conference -name=\'XXX\'\n`);
  }

  let conferenceName = '';
  let ogImageUrl = '';
  const url = process.argv[3];
  if (url) {
    await fetch(url)
      .then((res) => res.text())
      .then((body) => {
        const root = parse(body);

        const title = root.querySelector('meta[property="og:title"]');
        conferenceName = title?.getAttribute('content') || '';

        const ogImageMeta = root.querySelector('meta[property="og:image"]');
        ogImageUrl = ogImageMeta?.getAttribute('content') || '';
      });
  }

  const conf = `{
  "id": "",
  "name": "${conferenceName}",
  "url": "${url}",
  "started_at": "",
  "ended_at": "",
  "logo_image_url": "${ogImageUrl}"
}`;

  fs.writeFileSync(`./contents/conferences/${fileName}.json`, conf);
} catch(e) {
  // @ts-ignore
  console.error(`\n${e.message}`);
}