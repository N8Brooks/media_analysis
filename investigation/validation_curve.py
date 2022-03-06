#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Validation curves which are used to evaluate individual parameters of the model.
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import StratifiedShuffleSplit
from sklearn.linear_model import SGDClassifier
from sklearn.feature_extraction.text import HashingVectorizer
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import validation_curve
from tqdm import tqdm

# Society or economy axis
AXIS = 'economy'

train = pd.read_csv(f'../datasets/{AXIS}_train.csv')
test = pd.read_csv(f'../datasets/{AXIS}_test.csv')

train['pseudo_class'] = tuple(f'{target},{question}' for target, question in
                              zip(train['target'], train['question']))

hashingvectorizer = HashingVectorizer(
    decode_error='ignore',
    strip_accents='unicode',
    lowercase=True,
    stop_words=None,
    preprocessor=None,
    ngram_range=(1, 1),
    norm=None,
    # this is altered for parameters that increase the unique token count
    n_features=2**16,
    binary=True,
    alternate_sign=False,
    dtype=np.float32,
)

sgdclassifier = SGDClassifier(
    alpha=1e-3,
    class_weight='balanced',
    fit_intercept=False,
    loss='modified_huber',
    learning_rate='constant',
    average=True,
    eta0=1e-5,
    tol=1e-4,
    verbose=2,
)

pipeline = make_pipeline(hashingvectorizer, sgdclassifier)

parameters = [
    # ['hashingvectorizer__strip_accents', (None, 'unicode')],
    # ['hashingvectorizer__lowercase', (False, True)],
    # ['hashingvectorizer__stop_words', (None, 'english')],
    # ['hashingvectorizer__ngram_range', ((1, 1), (2, 2), (3, 3))],
    # ['hashingvectorizer__n_features', (
    #     2**10, 2**12, 2**14, 2**16, 2**17, 2**18, 2**19, 2**20, 2**22, 2**24)],
    # ['hashingvectorizer__binary', (False, True)],
    # ['hashingvectorizer__norm', (None, 'l2')],
    # ['hashingvectorizer__alternate_sign', (False, True)],
    # ['sgdclassifier__loss', ('log', 'modified_huber')],
    # ['sgdclassifier__penalty', (None, 'l2')],
    # ['sgdclassifier__alpha', (1e-1, 1e-2, 1e-3, 1e-4, 1e-5)],
    # Too many other parameters are required to optimally evaluate learning rates
    # ['sgdclassifier__learning_rate', ('constant', 'optimal')],
    ['sgdclassifier__eta0', (1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6, 1e-7)],
    # ['sgdclassifier__average', (False, len(train), True)],
    # ['sgdclassifier__warm_start', (False, True)],
    # ['sgdclassifier__fit_intercept', (False, True)],
]

cv = StratifiedShuffleSplit(
    n_splits=50,
    test_size=1000,
)

for param_name, param_range in tqdm(parameters):
    _, test_scores = validation_curve(
        pipeline,
        train['text'],
        train['target'],
        param_name=param_name,
        param_range=param_range,
        cv=cv,
        n_jobs=-1,
    )

    # Heuristic
    is_range = len(param_range) > 3

    if is_range:
        df = pd.DataFrame(
            test_scores.mean(axis=1),
            index=tuple('None' if i is None else i for i in param_range),
            columns=['weighted f1 score'],
        )
        ax = df.plot(title=param_name, logx=True)
        # This is the only range search that is base 2
        if param_name == 'hashingvectorizer__n_features':
            ax.set_xscale('log', basex=2)
    else:
        df = pd.DataFrame(
            test_scores.T,
            columns=tuple('None' if i is None else i for i in param_range),
        )
        ax = df.boxplot()
        ax.set_title(param_name)

    ax.set_xlabel('parameter values')
    ax.set_ylabel('accuracy')

    plt.show()
