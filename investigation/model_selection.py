#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Provides insight on optimal parameters for a binary classifier on the economy
or society datset.
"""

import numpy as np
import pandas as pd
from sklearn.utils.class_weight import compute_sample_weight
from sklearn.linear_model import SGDClassifier
from sklearn.feature_extraction.text import HashingVectorizer
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import precision_recall_fscore_support
from sklearn.pipeline import make_pipeline

# Society or economy axis
AXIS = 'society'

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
    n_features=2**16,
    binary=True,
    alternate_sign=False,
    dtype=np.float32,
)

sgdclassifier = SGDClassifier(
    alpha=1e-6,
    class_weight='balanced',
    fit_intercept=False,
    loss='modified_huber',
    learning_rate='constant',
    average=True,
    eta0=1e-3,
    tol=1e-4,
)

pipeline = make_pipeline(hashingvectorizer, sgdclassifier)

parameters = {
    # 'hashingvectorizer__strip_accents': (None, 'unicode'),
    # 'hashingvectorizer__lowercase': (False, True),
    # 'hashingvectorizer__stop_words': (None, 'english'),
    # 'hashingvectorizer__ngram_range': ((1, 1), (2, 2),  (3, 3)),
    # 'hashingvectorizer__n_features': (2**16, 2**17, 2**18, 2**19),
    # 'hashingvectorizer__binary': (False, True),
    # 'hashingvectorizer__norm': (None, 'l2'),
    # 'hashingvectorizer__alternate_sign': (False, True),
    'sgdclassifier__loss': ('log', 'modified_huber'),
    # 'sgdclassifier__penalty': (None, 'l2'),
    'sgdclassifier__alpha': (1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6, 1e-7, 1e-8, 1e-9, 1e-10),
    # 'sgdclassifier__learning_rate': ('constant', 'optimal'),
    'sgdclassifier__eta0': (1e2, 1e1, 1e0, 1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6, 1e-7, 1e-8),
    # 'sgdclassifier__average': (False, len(train), True),
    # 'sgdclassifier__warm_start': (False, True),
    # 'sgdclassifier__fit_intercept': (False, True),
}

grid_search = GridSearchCV(
    pipeline,
    parameters,
    verbose=2,
    scoring='f1_weighted',
    n_jobs=-1,
    cv=2,
    error_score=0,
)

weights = compute_sample_weight('balanced', train['pseudo_class'])

grid_search.fit(train['text'], train['target'])

results = pd.DataFrame(grid_search.cv_results_)

print(
      grid_search.score(test['text'], test['target']),
      precision_recall_fscore_support(
          test['target'],
          grid_search.predict(test['text']),
          average='weighted',
      )
)

# Used to show advantage of modified huber loss on these datasets
results.groupby('param_sgdclassifier__loss').describe()

# Used to show that 1e-6 is a decent choice
alpha_grouped = results.groupby('param_sgdclassifier__alpha')['mean_test_score']
domain = [p / 1000 for p in range(500, 1001)]
ax = pd.DataFrame([alpha_grouped.quantile(p) for p in domain], index=domain).plot()
ax.set_xlabel('quantile')

# Used to show that 0.01 is fine for eta0
alpha_subset = results[results['param_sgdclassifier__alpha'] == 1e-6]
eta0_grouped = alpha_subset.groupby('param_sgdclassifier__eta0')['mean_test_score']
ax = eta0_grouped.max().plot(logx=True)
ax.set_ylabel('f1 score weighted')

