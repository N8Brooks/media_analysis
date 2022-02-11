# Site

A progressive web app that can be used to predict some text on the political
compass axes. Note that in order to compute the confidence intervals the text is
split upon double newlines.

https://n8brooks.github.io/media_analysis/site/

## Bundling

The UI is bundled using the Deno cli as follows.

```bash
deno bundle --no-check political_compass.ts site/political_compass.js
```
