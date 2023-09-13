# cc-api
cc-api is Conference Calendar API.


## Setup
```shell
$ npm install
```

```shell
$ cp .dev.vars.example .dev.vars
``` 

```shell
$ npm run dev
```

## Add a new conference
1. Run command
```shell
$ npm run create-conference -filename='FILENAME'

or you should try using url option if you want to get automatically conference name and og image. 

$ npm run create-conference -filename='FILENAME' -url=''
```
2. Write conference data to contents/conferences/\<FILENAME\>.json
3. Commit and create a PR
4. You must attache a `conference-add` label 

## Deploy
1. Overwrite kv_namespaces in wrangler.toml 
2. Run command
```shell
npm run deploy
```
