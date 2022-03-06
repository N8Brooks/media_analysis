#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Provides considerations for the amount of features to use for the hashing vectorizer.
"""

from matplotlib import ticker
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import HashingVectorizer
from tqdm import trange

def count_indices(**parameters):
    # Returns the number of non-zero indices for the given parameters
    vectorizer = HashingVectorizer(**parameters)
    indices = vectorizer.transform(train['text']).sum(axis=0)
    return np.count_nonzero(indices)


# All text considered for collisions
train = pd.read_csv('../datasets/society_train.csv')

# Presumed to contain no or almost no hashing collisions
print('Hashing max monogram features')
max_monogram_features = count_indices(n_features=2**31 - 1, ngram_range=(1, 1))
print('Hashing max bigram features')
max_bigram_features = count_indices(n_features=2**31 - 1, ngram_range=(2, 2))
print('Hashing max trigram features')
max_trigram_features = count_indices(n_features=2**31 - 1, ngram_range=(3, 3))

data = []

for i in trange(10, 25):
    n_features = 2**i

    monogram_features = count_indices(ngram_range=(1, 1), n_features=n_features)
    bigram_features = count_indices(ngram_range=(2, 2), n_features=n_features)
    trigram_features = count_indices(ngram_range=(3, 3), n_features=n_features)

    data.append(dict(
        n_features=n_features,
        monogram_features=monogram_features,
        monogram_collisions=(max_monogram_features - monogram_features) / n_features,
        monogram_utilization=monogram_features / max_monogram_features,
        bigram_features=bigram_features,
        bigram_collisions=(max_bigram_features - bigram_features) / n_features,
        bigram_utilization=bigram_features / max_bigram_features,
        trigram_features=trigram_features,
        trigram_collisions=(max_trigram_features - trigram_features) / n_features,
        trigram_utilization=trigram_features / max_trigram_features,
    ))

df = pd.DataFrame(data)
df.index = df['n_features']

ax = df[[
    'monogram_collisions',
    'bigram_collisions',
    'trigram_collisions',
]].plot(ylim=(0, 1))

ax.set_xscale('log', basex=2)

ax.yaxis.set_major_formatter(ticker.PercentFormatter(1.0))
