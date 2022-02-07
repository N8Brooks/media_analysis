# models

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
Epoch 0, Avg. loss: 1.0456030133332315
Epoch 1, Avg. loss: 0.8750765934456907
Epoch 2, Avg. loss: 0.7774955568440148
Epoch 3, Avg. loss: 0.7037361391599315
Epoch 4, Avg. loss: 0.6641013423881993
Epoch 5, Avg. loss: 0.6425381208971082
Epoch 6, Avg. loss: 0.610598832460426
Epoch 7, Avg. loss: 0.5888830821994323
Epoch 8, Avg. loss: 0.5642783778610985
Epoch 9, Avg. loss: 0.5443831272369841
Epoch 10, Avg. loss: 0.5274948591982481
Epoch 11, Avg. loss: 0.5178509137499685
Epoch 12, Avg. loss: 0.5002093683303623
Epoch 13, Avg. loss: 0.48453694200811587
Epoch 14, Avg. loss: 0.47353224612323025
Epoch 15, Avg. loss: 0.4620670112732935
┌────────────────────┬───────────────┬───────────────┐
│ (idx)              │ True Positive │ True Negative │
├────────────────────┼───────────────┼───────────────┤
│ Predicted Positive │            21 │             4 │
│ Predicted Negative │             6 │            19 │
└────────────────────┴───────────────┴───────────────┘
┌───────────┬────────────────────┐
│ (idx)     │ Values             │
├───────────┼────────────────────┤
│ accuracy  │                0.8 │
│ precision │               0.84 │
│ recall    │ 0.7777777777777778 │
│ f1Score   │ 0.8076923076923077 │
└───────────┴────────────────────┘
```

## society_model

```bash
deno run -A scripts/train_model.ts society -w
Training on society axis dataset
Epoch 0, Avg. loss: 1.0557115801144885
Epoch 1, Avg. loss: 0.9193881294288871
Epoch 2, Avg. loss: 0.8553507908586137
Epoch 3, Avg. loss: 0.8158118459971103
Epoch 4, Avg. loss: 0.7801470867261083
Epoch 5, Avg. loss: 0.7570769092348246
Epoch 6, Avg. loss: 0.7367512899012622
Epoch 7, Avg. loss: 0.7182461514146529
Epoch 8, Avg. loss: 0.7004820406492485
Epoch 9, Avg. loss: 0.6852801957044844
Epoch 10, Avg. loss: 0.6720932740146041
Epoch 11, Avg. loss: 0.6638435871980166
Epoch 12, Avg. loss: 0.6509482786389396
Epoch 13, Avg. loss: 0.6418692488145986
Epoch 14, Avg. loss: 0.6300191736720105
Epoch 15, Avg. loss: 0.6231550011938507
┌────────────────────┬───────────────┬───────────────┐
│ (idx)              │ True Positive │ True Negative │
├────────────────────┼───────────────┼───────────────┤
│ Predicted Positive │            26 │             8 │
│ Predicted Negative │             5 │            29 │
└────────────────────┴───────────────┴───────────────┘
┌───────────┬────────────────────┐
│ (idx)     │ Values             │
├───────────┼────────────────────┤
│ accuracy  │ 0.8088235294117647 │
│ precision │ 0.7647058823529411 │
│ recall    │ 0.8387096774193549 │
│ f1Score   │ 0.7999999999999999 │
└───────────┴────────────────────┘
```
