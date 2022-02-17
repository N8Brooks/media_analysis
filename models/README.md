# Models

Output collected from the models saved in this directory. The precision, recall,
and f1 score are weighted. The 'Positives' of the confusion matrix are
referencing the classes designated `1`.Both models are generally about 70%
accurate and take around 1s to run. Both of these runs are above average. Some
of the differences in accuracy per run could be due to the constant number of
epochs.

## economy_model

```bash
> deno run -A scripts/train_model.ts economy -w
Training on economy axis dataset
Epoch 0 - Average loss: 36.9771
Epoch 1 - Average loss: 4.8111
Epoch 2 - Average loss: 1.9485
Epoch 3 - Average loss: 1.0061
Epoch 4 - Average loss: 0.6930
Epoch 5 - Average loss: 0.5230
Epoch 6 - Average loss: 0.4459
Epoch 7 - Average loss: 0.3898
Epoch 8 - Average loss: 0.3722
Epoch 9 - Average loss: 0.3624
Epoch 10 - Average loss: 0.3528
Epoch 11 - Average loss: 0.3428
Epoch 12 - Average loss: 0.3486
Epoch 13 - Average loss: 0.3400
Epoch 14 - Average loss: 0.3390
Epoch 15 - Average loss: 0.3416
Epoch 16 - Average loss: 0.3379
Epoch 17 - Average loss: 0.3360
Epoch 18 - Average loss: 0.3344
Epoch 19 - Average loss: 0.3360
Epoch 20 - Average loss: 0.3337
Epoch 21 - Average loss: 0.3352
Epoch 22 - Average loss: 0.3331
Epoch 23 - Average loss: 0.3334
Epoch 24 - Average loss: 0.3331
Epoch 25 - Average loss: 0.3332
Epoch 26 - Average loss: 0.3328
Epoch 27 - Average loss: 0.3328
Epoch 28 - Average loss: 0.3320
Epoch 29 - Average loss: 0.3327
Epoch 30 - Average loss: 0.3312
Epoch 31 - Average loss: 0.3322
Epoch 32 - Average loss: 0.3312
Epoch 33 - Average loss: 0.3335
Epoch 34 - Average loss: 0.3314
Epoch 35 - Average loss: 0.3307
Epoch 36 - Average loss: 0.3311
Epoch 37 - Average loss: 0.3312
Epoch 38 - Average loss: 0.3303
Epoch 39 - Average loss: 0.3314
Epoch 40 - Average loss: 0.3296
Epoch 41 - Average loss: 0.3298
Epoch 42 - Average loss: 0.3310
Epoch 43 - Average loss: 0.3305
Epoch 44 - Average loss: 0.3287
Epoch 45 - Average loss: 0.3304
Epoch 46 - Average loss: 0.3309
Epoch 47 - Average loss: 0.3303
Testing on economy axis dataset
┌────────────────────┬───────────────┬───────────────┐
│ (idx)              │ True Positive │ True Negative │
├────────────────────┼───────────────┼───────────────┤
│ Predicted Positive │            18 │             5 │
│ Predicted Negative │             7 │            20 │
└────────────────────┴───────────────┴───────────────┘
┌───────────┬────────┐
│ (idx)     │ Values │
├───────────┼────────┤
│ accuracy  │   0.76 │
│ precision │ 0.7617 │
│ recall    │   0.76 │
│ f1Score   │ 0.7596 │
└───────────┴────────┘
Saving economy axis model
```

## society_model

```bash
> deno run -A scripts/train_model.ts society -w
Training on society axis dataset
Epoch 0 - Average loss: 7.7587
Epoch 1 - Average loss: 1.1550
Epoch 2 - Average loss: 0.7374
Epoch 3 - Average loss: 0.6209
Epoch 4 - Average loss: 0.5856
Epoch 5 - Average loss: 0.5699
Epoch 6 - Average loss: 0.5622
Epoch 7 - Average loss: 0.5525
Epoch 8 - Average loss: 0.5519
Epoch 9 - Average loss: 0.5461
Epoch 10 - Average loss: 0.5447
Epoch 11 - Average loss: 0.5418
Epoch 12 - Average loss: 0.5404
Epoch 13 - Average loss: 0.5386
Epoch 14 - Average loss: 0.5375
Epoch 15 - Average loss: 0.5356
Epoch 16 - Average loss: 0.5358
Epoch 17 - Average loss: 0.5345
Epoch 18 - Average loss: 0.5325
Epoch 19 - Average loss: 0.5325
Epoch 20 - Average loss: 0.5316
Epoch 21 - Average loss: 0.5325
Epoch 22 - Average loss: 0.5312
Epoch 23 - Average loss: 0.5317
Epoch 24 - Average loss: 0.5302
Epoch 25 - Average loss: 0.5301
Epoch 26 - Average loss: 0.5293
Epoch 27 - Average loss: 0.5297
Epoch 28 - Average loss: 0.5280
Epoch 29 - Average loss: 0.5277
Epoch 30 - Average loss: 0.5288
Epoch 31 - Average loss: 0.5275
Epoch 32 - Average loss: 0.5281
Epoch 33 - Average loss: 0.5272
Epoch 34 - Average loss: 0.5276
Epoch 35 - Average loss: 0.5267
Epoch 36 - Average loss: 0.5264
Epoch 37 - Average loss: 0.5275
Epoch 38 - Average loss: 0.5268
Epoch 39 - Average loss: 0.5274
Epoch 40 - Average loss: 0.5257
Epoch 41 - Average loss: 0.5254
Epoch 42 - Average loss: 0.5260
Epoch 43 - Average loss: 0.5253
Epoch 44 - Average loss: 0.5255
Epoch 45 - Average loss: 0.5261
Epoch 46 - Average loss: 0.5260
Epoch 47 - Average loss: 0.5249
Testing on society axis dataset
┌────────────────────┬───────────────┬───────────────┐
│ (idx)              │ True Positive │ True Negative │
├────────────────────┼───────────────┼───────────────┤
│ Predicted Positive │            27 │            10 │
│ Predicted Negative │             7 │            24 │
└────────────────────┴───────────────┴───────────────┘
┌───────────┬────────┐
│ (idx)     │ Values │
├───────────┼────────┤
│ accuracy  │   0.75 │
│ precision │  0.752 │
│ recall    │   0.75 │
│ f1Score   │ 0.7495 │
└───────────┴────────┘
Saving society axis model
```
