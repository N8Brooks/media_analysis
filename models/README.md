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
Epoch 0 - Average loss: 47.6811
Epoch 1 - Average loss: 5.4808
Epoch 2 - Average loss: 2.3169
Epoch 3 - Average loss: 1.2316
Epoch 4 - Average loss: 0.8358
Epoch 5 - Average loss: 0.5965
Epoch 6 - Average loss: 0.4786
Epoch 7 - Average loss: 0.4021
Epoch 8 - Average loss: 0.3845
Epoch 9 - Average loss: 0.3663
Epoch 10 - Average loss: 0.3458
Epoch 11 - Average loss: 0.3476
Epoch 12 - Average loss: 0.3417
Epoch 13 - Average loss: 0.3336
Epoch 14 - Average loss: 0.3312
Epoch 15 - Average loss: 0.3328
Epoch 16 - Average loss: 0.3308
Epoch 17 - Average loss: 0.3302
Epoch 18 - Average loss: 0.3315
Epoch 19 - Average loss: 0.3312
Epoch 20 - Average loss: 0.3322
Epoch 21 - Average loss: 0.3274
Epoch 22 - Average loss: 0.3302
Epoch 23 - Average loss: 0.3280
Epoch 24 - Average loss: 0.3277
Epoch 25 - Average loss: 0.3263
Epoch 26 - Average loss: 0.3279
Epoch 27 - Average loss: 0.3287
Epoch 28 - Average loss: 0.3286
Epoch 29 - Average loss: 0.3268
Epoch 30 - Average loss: 0.3279
Epoch 31 - Average loss: 0.3272
Epoch 32 - Average loss: 0.3259
Epoch 33 - Average loss: 0.3243
Epoch 34 - Average loss: 0.3250
Epoch 35 - Average loss: 0.3288
Epoch 36 - Average loss: 0.3258
Epoch 37 - Average loss: 0.3267
Epoch 38 - Average loss: 0.3262
Epoch 39 - Average loss: 0.3251
Epoch 40 - Average loss: 0.3264
Epoch 41 - Average loss: 0.3265
Epoch 42 - Average loss: 0.3271
Epoch 43 - Average loss: 0.3261
Epoch 44 - Average loss: 0.3249
Epoch 45 - Average loss: 0.3257
Epoch 46 - Average loss: 0.3255
Epoch 47 - Average loss: 0.3260
Epoch 48 - Average loss: 0.3254
Epoch 49 - Average loss: 0.3260
Epoch 50 - Average loss: 0.3242
Epoch 51 - Average loss: 0.3250
Epoch 52 - Average loss: 0.3248
Epoch 53 - Average loss: 0.3245
Epoch 54 - Average loss: 0.3261
Epoch 55 - Average loss: 0.3246
Epoch 56 - Average loss: 0.3253
Epoch 57 - Average loss: 0.3235
Epoch 58 - Average loss: 0.3251
Epoch 59 - Average loss: 0.3255
Epoch 60 - Average loss: 0.3256
Epoch 61 - Average loss: 0.3247
Epoch 62 - Average loss: 0.3233
Epoch 63 - Average loss: 0.3234
Epoch 64 - Average loss: 0.3241
Epoch 65 - Average loss: 0.3240
Epoch 66 - Average loss: 0.3252
Epoch 67 - Average loss: 0.3259
Epoch 68 - Average loss: 0.3238
Epoch 69 - Average loss: 0.3239
Epoch 70 - Average loss: 0.3235
Epoch 71 - Average loss: 0.3239
Epoch 72 - Average loss: 0.3250
Epoch 73 - Average loss: 0.3242
Epoch 74 - Average loss: 0.3247
Epoch 75 - Average loss: 0.3242
Epoch 76 - Average loss: 0.3243
Epoch 77 - Average loss: 0.3249
Epoch 78 - Average loss: 0.3249
Epoch 79 - Average loss: 0.3234
Epoch 80 - Average loss: 0.3239
Epoch 81 - Average loss: 0.3240
Epoch 82 - Average loss: 0.3242
Epoch 83 - Average loss: 0.3244
Epoch 84 - Average loss: 0.3236
Epoch 85 - Average loss: 0.3240
Epoch 86 - Average loss: 0.3225
Epoch 87 - Average loss: 0.3235
Epoch 88 - Average loss: 0.3235
Epoch 89 - Average loss: 0.3243
Epoch 90 - Average loss: 0.3240
Epoch 91 - Average loss: 0.3231
Epoch 92 - Average loss: 0.3255
Epoch 93 - Average loss: 0.3238
Epoch 94 - Average loss: 0.3234
Epoch 95 - Average loss: 0.3260
Epoch 96 - Average loss: 0.3225
Epoch 97 - Average loss: 0.3237
Epoch 98 - Average loss: 0.3235
Epoch 99 - Average loss: 0.3232
Testing on economy axis dataset
┌────────────────────┬───────────────┬───────────────┐
│ (idx)              │ True Positive │ True Negative │
├────────────────────┼───────────────┼───────────────┤
│ Predicted Positive │            22 │             6 │
│ Predicted Negative │             3 │            19 │
└────────────────────┴───────────────┴───────────────┘
┌───────────┬────────┐
│ (idx)     │ Values │
├───────────┼────────┤
│ accuracy  │   0.82 │
│ precision │ 0.8247 │
│ recall    │   0.82 │
│ f1Score   │ 0.8193 │
└───────────┴────────┘
Saving economy axis model
```

## society_model

```bash
> deno run -A scripts/train_model.ts society -w          
Training on society axis dataset
Epoch 0 - Average loss: 9.8239
Epoch 1 - Average loss: 1.2222
Epoch 2 - Average loss: 0.7290
Epoch 3 - Average loss: 0.6237
Epoch 4 - Average loss: 0.5889
Epoch 5 - Average loss: 0.5715
Epoch 6 - Average loss: 0.5619
Epoch 7 - Average loss: 0.5542
Epoch 8 - Average loss: 0.5493
Epoch 9 - Average loss: 0.5441
Epoch 10 - Average loss: 0.5431
Epoch 11 - Average loss: 0.5403
Epoch 12 - Average loss: 0.5385
Epoch 13 - Average loss: 0.5358
Epoch 14 - Average loss: 0.5364
Epoch 15 - Average loss: 0.5348
Epoch 16 - Average loss: 0.5346
Epoch 17 - Average loss: 0.5323
Epoch 18 - Average loss: 0.5319
Epoch 19 - Average loss: 0.5299
Epoch 20 - Average loss: 0.5303
Epoch 21 - Average loss: 0.5285
Epoch 22 - Average loss: 0.5279
Epoch 23 - Average loss: 0.5289
Epoch 24 - Average loss: 0.5270
Epoch 25 - Average loss: 0.5281
Epoch 26 - Average loss: 0.5284
Epoch 27 - Average loss: 0.5261
Epoch 28 - Average loss: 0.5262
Epoch 29 - Average loss: 0.5262
Epoch 30 - Average loss: 0.5262
Epoch 31 - Average loss: 0.5264
Epoch 32 - Average loss: 0.5259
Epoch 33 - Average loss: 0.5241
Epoch 34 - Average loss: 0.5249
Epoch 35 - Average loss: 0.5251
Epoch 36 - Average loss: 0.5253
Epoch 37 - Average loss: 0.5240
Epoch 38 - Average loss: 0.5248
Epoch 39 - Average loss: 0.5250
Epoch 40 - Average loss: 0.5241
Epoch 41 - Average loss: 0.5232
Epoch 42 - Average loss: 0.5239
Epoch 43 - Average loss: 0.5240
Epoch 44 - Average loss: 0.5239
Epoch 45 - Average loss: 0.5230
Epoch 46 - Average loss: 0.5225
Epoch 47 - Average loss: 0.5227
Epoch 48 - Average loss: 0.5243
Epoch 49 - Average loss: 0.5224
Epoch 50 - Average loss: 0.5225
Epoch 51 - Average loss: 0.5234
Epoch 52 - Average loss: 0.5229
Epoch 53 - Average loss: 0.5220
Epoch 54 - Average loss: 0.5218
Epoch 55 - Average loss: 0.5222
Epoch 56 - Average loss: 0.5224
Epoch 57 - Average loss: 0.5220
Epoch 58 - Average loss: 0.5219
Epoch 59 - Average loss: 0.5228
Epoch 60 - Average loss: 0.5219
Epoch 61 - Average loss: 0.5222
Epoch 62 - Average loss: 0.5219
Epoch 63 - Average loss: 0.5219
Epoch 64 - Average loss: 0.5216
Epoch 65 - Average loss: 0.5226
Epoch 66 - Average loss: 0.5215
Epoch 67 - Average loss: 0.5213
Epoch 68 - Average loss: 0.5217
Epoch 69 - Average loss: 0.5214
Epoch 70 - Average loss: 0.5217
Epoch 71 - Average loss: 0.5214
Epoch 72 - Average loss: 0.5213
Epoch 73 - Average loss: 0.5210
Epoch 74 - Average loss: 0.5208
Epoch 75 - Average loss: 0.5214
Epoch 76 - Average loss: 0.5209
Epoch 77 - Average loss: 0.5205
Epoch 78 - Average loss: 0.5213
Epoch 79 - Average loss: 0.5210
Epoch 80 - Average loss: 0.5212
Epoch 81 - Average loss: 0.5209
Epoch 82 - Average loss: 0.5213
Epoch 83 - Average loss: 0.5205
Epoch 84 - Average loss: 0.5208
Epoch 85 - Average loss: 0.5209
Epoch 86 - Average loss: 0.5205
Epoch 87 - Average loss: 0.5208
Epoch 88 - Average loss: 0.5204
Epoch 89 - Average loss: 0.5212
Epoch 90 - Average loss: 0.5204
Epoch 91 - Average loss: 0.5204
Epoch 92 - Average loss: 0.5208
Epoch 93 - Average loss: 0.5207
Epoch 94 - Average loss: 0.5204
Epoch 95 - Average loss: 0.5204
Epoch 96 - Average loss: 0.5202
Epoch 97 - Average loss: 0.5203
Epoch 98 - Average loss: 0.5208
Epoch 99 - Average loss: 0.5202
Testing on society axis dataset
┌────────────────────┬───────────────┬───────────────┐
│ (idx)              │ True Positive │ True Negative │
├────────────────────┼───────────────┼───────────────┤
│ Predicted Positive │            28 │             9 │
│ Predicted Negative │             6 │            25 │
└────────────────────┴───────────────┴───────────────┘
┌───────────┬────────┐
│ (idx)     │ Values │
├───────────┼────────┤
│ accuracy  │ 0.7794 │
│ precision │ 0.7816 │
│ recall    │ 0.7794 │
│ f1Score   │  0.779 │
└───────────┴────────┘
Saving society axis model
```
