# Extension

A web extension that parses pages to rate it on the political compass when
clicked.

## Bundling

```bash
deno bundle --no-check political_compass.ts extension/political_compass.js
cp models/society_model.bin extension/society_model.bin
cp models/economy_model.bin extension/economy_model.bin
```

## Loading

Must be loaded as an unpacked extension currently.
