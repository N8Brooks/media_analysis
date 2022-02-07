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
Epoch 0, Avg. loss: 1.0500518536393961
Epoch 1, Avg. loss: 0.8536597606813059
Epoch 2, Avg. loss: 0.7656426897947045
Epoch 3, Avg. loss: 0.7085746795652262
Epoch 4, Avg. loss: 0.6776270079709324
Epoch 5, Avg. loss: 0.6324652977255736
Epoch 6, Avg. loss: 0.6131087790214698
Epoch 7, Avg. loss: 0.5807621209696485
Epoch 8, Avg. loss: 0.5685448583813554
Epoch 9, Avg. loss: 0.5444036734965171
Epoch 10, Avg. loss: 0.5271441977464659
Epoch 11, Avg. loss: 0.5106425829145629
Epoch 12, Avg. loss: 0.49810497612123505
Epoch 13, Avg. loss: 0.48755060579699283
Epoch 14, Avg. loss: 0.47646573171634554
Epoch 15, Avg. loss: 0.46243456822392437
Testing on economy axis dataset
┌────────────────────┬───────────────┬───────────────┐
│ (idx)              │ True Positive │ True Negative │
├────────────────────┼───────────────┼───────────────┤
│ Predicted Positive │            22 │             3 │
│ Predicted Negative │             5 │            20 │
└────────────────────┴───────────────┴───────────────┘
┌───────────┬────────────────────┐
│ (idx)     │ Values             │
├───────────┼────────────────────┤
│ accuracy  │               0.84 │
│ precision │               0.88 │
│ recall    │ 0.8148148148148148 │
│ f1Score   │ 0.8461538461538461 │
└───────────┴────────────────────┘
Saving economy axis model
```

## society_model

```bash
deno run -A scripts/train_model.ts society -w
Training on society axis dataset
Epoch 0, Avg. loss: 1.059608548821629
Epoch 1, Avg. loss: 0.9182983060815542
Epoch 2, Avg. loss: 0.8522585461893509
Epoch 3, Avg. loss: 0.8139976571271035
Epoch 4, Avg. loss: 0.7805352581906114
Epoch 5, Avg. loss: 0.754577249506281
Epoch 6, Avg. loss: 0.7360376648628632
Epoch 7, Avg. loss: 0.7134852512765126
Epoch 8, Avg. loss: 0.6981678917140495
Epoch 9, Avg. loss: 0.6881649494973998
Epoch 10, Avg. loss: 0.6716983133142098
Epoch 11, Avg. loss: 0.6610684034647943
Epoch 12, Avg. loss: 0.649866898959329
Epoch 13, Avg. loss: 0.639284183598748
Epoch 14, Avg. loss: 0.6306413065420982
Epoch 15, Avg. loss: 0.6248842319533157
Testing on society axis dataset
┌────────────────────┬───────────────┬───────────────┐
│ (idx)              │ True Positive │ True Negative │
├────────────────────┼───────────────┼───────────────┤
│ Predicted Positive │            28 │             6 │
│ Predicted Negative │            13 │            21 │
└────────────────────┴───────────────┴───────────────┘
┌───────────┬────────────────────┐
│ (idx)     │ Values             │
├───────────┼────────────────────┤
│ accuracy  │ 0.7205882352941176 │
│ precision │ 0.8235294117647058 │
│ recall    │ 0.6829268292682927 │
│ f1Score   │ 0.7466666666666667 │
└───────────┴────────────────────┘
Saving society axis model
```
