# FreEat

A small web app creating a summary of the menus provided by some of the mensas in Fribourg.

Run in a local dev environment:

```shell
docker compose up --build
```

Requires the environment variable `PLAYWRIGHT` containing a URL pointing to
a [playwright-renderer](https://github.com/baeriswyln/playwright-renderer) instance. 