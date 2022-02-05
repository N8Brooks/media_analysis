# models

Output collected from the models saved in this directory.

## economy_model

```bash
deno run -A train_model.ts economy -w
INFO Epoch 0, Avg. loss: 1.0533199304577727
INFO Epoch 1, Avg. loss: 0.8680711245868036
INFO Epoch 2, Avg. loss: 0.7725482364972713
INFO Epoch 3, Avg. loss: 0.7217389345021895
INFO Epoch 4, Avg. loss: 0.6692300176707479
INFO Epoch 5, Avg. loss: 0.6385502723331029
INFO Epoch 6, Avg. loss: 0.6159942508432027
INFO Epoch 7, Avg. loss: 0.5913369554339989
INFO Epoch 8, Avg. loss: 0.5708164327690193
INFO Epoch 9, Avg. loss: 0.5486298618033132
INFO Epoch 10, Avg. loss: 0.5237972650469392
INFO Epoch 11, Avg. loss: 0.50522447621125
INFO Epoch 12, Avg. loss: 0.503318256092782
INFO Epoch 13, Avg. loss: 0.48778306118205517
INFO Epoch 14, Avg. loss: 0.48065083917491436
INFO Epoch 15, Avg. loss: 0.46431379042348014
┌────────────────────┬───────────────┬───────────────┐
│ (idx)              │ True Positive │ True Negative │
├────────────────────┼───────────────┼───────────────┤
│ Predicted Positive │            18 │             7 │
│ Predicted Negative │             7 │            18 │
└────────────────────┴───────────────┴───────────────┘
┌───────────┬────────┐
│ (idx)     │ Values │
├───────────┼────────┤
│ accuracy  │   0.72 │
│ precision │   0.72 │
│ recall    │   0.72 │
│ f1Score   │   0.72 │
└───────────┴────────┘
```

## society_model

```bash
deno run -A train_model.ts society -w
Training on society axis dataset
Epoch 0, Avg. loss: 1.0564589605017392
Epoch 1, Avg. loss: 0.92899176630516
Epoch 2, Avg. loss: 0.8536413018321564
Epoch 3, Avg. loss: 0.8147131150351591
Epoch 4, Avg. loss: 0.7841781517116907
Epoch 5, Avg. loss: 0.7548366403098553
Epoch 6, Avg. loss: 0.7345397150448684
Epoch 7, Avg. loss: 0.7171831611571796
Epoch 8, Avg. loss: 0.7017068570466135
Epoch 9, Avg. loss: 0.684055926238581
Epoch 10, Avg. loss: 0.673885554000524
Epoch 11, Avg. loss: 0.662620798072956
Epoch 12, Avg. loss: 0.6480341859035951
Epoch 13, Avg. loss: 0.640744546434621
Epoch 14, Avg. loss: 0.6317995943590158
Epoch 15, Avg. loss: 0.6191457301423614
┌────────────────────┬───────────────┬───────────────┐
│ (idx)              │ True Positive │ True Negative │
├────────────────────┼───────────────┼───────────────┤
│ Predicted Positive │            31 │             3 │
│ Predicted Negative │            12 │            22 │
└────────────────────┴───────────────┴───────────────┘
┌───────────┬────────────────────┐
│ (idx)     │ Values             │
├───────────┼────────────────────┤
│ accuracy  │ 0.7794117647058824 │
│ precision │ 0.9117647058823529 │
│ recall    │ 0.7209302325581395 │
│ f1Score   │ 0.8051948051948051 │
└───────────┴────────────────────┘
```
