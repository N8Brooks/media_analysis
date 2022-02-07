# Models

Output collected from the models saved in this directory. The precision, recall,
and f1 score really only make sense when considering certain problems with
binary classification. Both models are generally ~70% accurate and take ~1s to
run. Both of these runs are extremely good - about 3 standard deviations above
typical results. Some of the differences in accuracy per run could be due to the
constant number of epochs.

## economy_model

```bash
deno run -A scripts/train_model.ts economy -w
Training on economy axis dataset
Epoch 0 - Average loss: 1.0500
Epoch 1 - Average loss: 0.8536
Epoch 2 - Average loss: 0.7656
Epoch 3 - Average loss: 0.7085
Epoch 4 - Average loss: 0.6776
Epoch 5 - Average loss: 0.6324
Epoch 6 - Average loss: 0.6131
Epoch 7 - Average loss: 0.5807
Epoch 8 - Average loss: 0.5685
Epoch 9 - Average loss: 0.5444
Epoch 10 - Average loss: 0.5271
Epoch 11 - Average loss: 0.5106
Epoch 12 - Average loss: 0.4981
Epoch 13 - Average loss: 0.4875
Epoch 14 - Average loss: 0.4764
Epoch 15 - Average loss: 0.4624
Testing on economy axis dataset
┌────────────────────┬───────────────┬───────────────┐
│ (idx)              │ True Positive │ True Negative │
├────────────────────┼───────────────┼───────────────┤
│ Predicted Positive │            22 │             3 │
│ Predicted Negative │             5 │            20 │
└────────────────────┴───────────────┴───────────────┘
┌───────────┬────────┐
│ (idx)     │ Values │
├───────────┼────────┤
│ accuracy  │   0.84 │
│ precision │   0.88 │
│ recall    │ 0.8148 │
│ f1Score   │ 0.8462 │
└───────────┴────────┘
Saving economy axis model
```

## society_model

```bash
deno run -A scripts/train_model.ts society -w
Training on society axis dataset
Epoch 0 - Average loss: 1.0596
Epoch 1 - Average loss: 0.9182
Epoch 2 - Average loss: 0.8522
Epoch 3 - Average loss: 0.8139
Epoch 4 - Average loss: 0.7805
Epoch 5 - Average loss: 0.7545
Epoch 6 - Average loss: 0.7360
Epoch 7 - Average loss: 0.7134
Epoch 8 - Average loss: 0.6981
Epoch 9 - Average loss: 0.6881
Epoch 10 - Average loss: 0.6716
Epoch 11 - Average loss: 0.6610
Epoch 12 - Average loss: 0.6498
Epoch 13 - Average loss: 0.6392
Epoch 14 - Average loss: 0.6306
Epoch 15 - Average loss: 0.6248
Testing on society axis dataset
┌────────────────────┬───────────────┬───────────────┐
│ (idx)              │ True Positive │ True Negative │
├────────────────────┼───────────────┼───────────────┤
│ Predicted Positive │            28 │             6 │
│ Predicted Negative │            13 │            21 │
└────────────────────┴───────────────┴───────────────┘
┌───────────┬────────┐
│ (idx)     │ Values │
├───────────┼────────┤
│ accuracy  │ 0.7206 │
│ precision │ 0.8235 │
│ recall    │ 0.6829 │
│ f1Score   │ 0.7467 │
└───────────┴────────┘
Saving society axis model
```
