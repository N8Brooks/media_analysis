#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Provides insight on optimal parameters for a binary classifier on the economy
or society datset.
"""

from itertools import chain
import re

import numpy as np
import pandas as pd
from sklearn.utils.class_weight import compute_sample_weight
from sklearn.linear_model import SGDClassifier
from sklearn.feature_extraction.text import HashingVectorizer
from sklearn.metrics import precision_recall_fscore_support
from sklearn.pipeline import make_pipeline
from nltk.stem.snowball import SnowballStemmer
from nltk.corpus import stopwords
from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.calibration import CalibrationDisplay
import matplotlib.pyplot as plt

# Society or economy axis
AXIS = "society"

dataset = pd.read_csv(f"../datasets/{AXIS}_train.csv")

dataset["pseudo_class"] = tuple(
    f"{target},{question}"
    for target, question in zip(dataset["target"], dataset["question"])
)

stem = SnowballStemmer('english').stem

regex = re.compile(r'(?u)\b\w\w+\b')

digits = re.compile(r'\d+')


def tokenizer(doc):
    doc = digits.sub('', doc)
    doc = doc.replace('_', ' ')
    return [stem(word) for word in regex.findall(doc)]


stop_words = list(chain.from_iterable((map(tokenizer, stopwords.words('english')))))


hashingvectorizer = HashingVectorizer(
    decode_error="ignore",
    strip_accents="unicode",
    lowercase=True,  # Doesn't matter with snowball
    preprocessor=None, # Default
    tokenizer=tokenizer,
    stop_words=stop_words,
    token_pattern=None, # Custom Tokenizer
    ngram_range=(1, 1), # Really the only option
    analyzer='word', # Default
    n_features=2 ** 20, # Default, I'm presuming this is independent
    binary=True,
    norm='l2', # Default - want probablistic
    alternate_sign=False, # Sure, why not, new
    dtype=np.float32, # dtype for when deployed
)

sgdclassifier = SGDClassifier(
    penalty='l2',
    fit_intercept=False, # Made results worse, don't want to store
    loss='log', # new
    max_iter=10000,
    tol=1e-4,
    learning_rate='optimal', # new
    average=True,
    class_weight="balanced",
    alpha = 1e-4, # new
)

train_X, test_X, train_y, test_y = train_test_split(hashingvectorizer.transform(dataset['text']), dataset['target'], stratify=dataset['pseudo_class'])

parameters = {
    # "loss": ("log", "modified_huber"),
    # "learning_rate": ('constant', "optimal"),
    # "alpha": (1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6, 1e-7),
    # "eta0": (1e2, 1e1, 1e0, 1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6),
}

search = GridSearchCV(
    sgdclassifier,
    parameters,
    scoring=['average_precision', 'recall', "f1_weighted", 'neg_brier_score'],
    n_jobs=-1,
    refit='f1_weighted',
    cv=100,
    verbose=2,
    error_score=0,
)

search.fit(train_X, train_y)

results = pd.DataFrame(search.cv_results_)
results['total'] = results['rank_test_neg_brier_score'] + results['rank_test_f1_weighted']

CalibrationDisplay.from_estimator(
    search,
    test_X,
    test_y,
    name=search.best_estimator_.loss,
)

plt.show()

test_proba = search.predict_proba(test_X)
pd.Series(test_proba[:, 1]).hist(bins=50).set_title(search.best_estimator_.loss)
