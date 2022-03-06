# Scripts

A collection of scripts for working with the binary classifier.

## model_interface

A script that is used to test the models with text. Exit with ctr+c.

```bash
deno run -A scripts/model_interface.ts
```

## train_model.ts

Script used for training the models on a dataset. First arg should be `economy`
for training on the economy dataset or `society` for training on the society
dataset. For the model to be saved run with `-w`.

```bash
deno run -A scripts/train_model.ts economy
```
