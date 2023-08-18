// @ts-ignore
import * as fs from "fs";
// @ts-ignore
import * as process from "process";

try{
  const conferenceName = process.argv[2];
  if (conferenceName === undefined) {
    throw new Error(`Conference Name must be required.\nYou should run this command with -name option.\n\nnpm run create-conference -name=\'XXX\'\n`);
  }

  const conf = `{
  "id": "",
  "name": "",
  "url": "",
  "started_at": "",
  "ended_at": "",
  "logo_image_url": ""
}`;

  fs.writeFileSync(`./contents/conferences/${conferenceName}.json`, conf);
} catch(e) {
  // @ts-ignore
  console.error(`\n${e.message}`);
}