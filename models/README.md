# Models

Output collected from the models saved in this directory. The precision, recall,
and f1 score are weighted. Both models are generally about 70% accurate and take
around 1s to run. Both of these runs are extremely good - about 2 standard
deviations above typical results. Some of the differences in accuracy per run
could be due to the constant number of epochs.

## economy_model

```bash
> deno run -A scripts/train_model.ts economy -w
Training on economy axis dataset
Epoch 0 - Average loss: 4.5849
Epoch 1 - Average loss: 3.6564
Epoch 2 - Average loss: 2.4507
Epoch 3 - Average loss: 1.9930
Epoch 4 - Average loss: 1.9368
Epoch 5 - Average loss: 1.4590
Epoch 6 - Average loss: 1.1992
Epoch 7 - Average loss: 1.0218
Epoch 8 - Average loss: 0.9177
Epoch 9 - Average loss: 0.7831
Epoch 10 - Average loss: 0.7001
Epoch 11 - Average loss: 0.6338
Epoch 12 - Average loss: 0.5830
Epoch 13 - Average loss: 0.5209
Epoch 14 - Average loss: 0.4701
Epoch 15 - Average loss: 0.4593
Testing on economy axis dataset
┌────────────────────┬───────────────┬───────────────┐
│ (idx)              │ True Positive │ True Negative │
├────────────────────┼───────────────┼───────────────┤
│ Predicted Positive │            19 │             5 │
│ Predicted Negative │             6 │            20 │
└────────────────────┴───────────────┴───────────────┘
┌───────────┬────────┐
│ (idx)     │ Values │
├───────────┼────────┤
│ accuracy  │   0.78 │
│ precision │ 0.7804 │
│ recall    │   0.78 │
│ f1Score   │ 0.7799 │
└───────────┴────────┘
Saving economy axis model
```

## society_model

```bash
> deno run -A scripts/train_model.ts society -w
Training on society axis dataset
Epoch 0 - Average loss: 4.4794
Epoch 1 - Average loss: 3.7444
Epoch 2 - Average loss: 3.5085
Epoch 3 - Average loss: 2.4909
Epoch 4 - Average loss: 2.3204
Epoch 5 - Average loss: 2.5140
Epoch 6 - Average loss: 2.0579
Epoch 7 - Average loss: 1.7601
Epoch 8 - Average loss: 1.6914
Epoch 9 - Average loss: 1.5535
Epoch 10 - Average loss: 1.6714
Epoch 11 - Average loss: 1.5174
Epoch 12 - Average loss: 1.7030
Epoch 13 - Average loss: 1.6518
Epoch 14 - Average loss: 1.3766
Epoch 15 - Average loss: 1.3085
Testing on society axis dataset
┌────────────────────┬───────────────┬───────────────┐
│ (idx)              │ True Positive │ True Negative │
├────────────────────┼───────────────┼───────────────┤
│ Predicted Positive │            27 │             9 │
│ Predicted Negative │             7 │            25 │
└────────────────────┴───────────────┴───────────────┘
┌───────────┬────────┐
│ (idx)     │ Values │
├───────────┼────────┤
│ accuracy  │ 0.7647 │
│ precision │ 0.7656 │
│ recall    │ 0.7647 │
│ f1Score   │ 0.7645 │
└───────────┴────────┘
```
