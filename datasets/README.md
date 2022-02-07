# datasets

Warning: these datasets contain explicit language.

Description of how labelled text samples were collected for the economic and
societal political compass axes.

## Prompts

The prompts provided in the `questions.csv` file were collected and labelled
from politicalcompass.org. For the economy dataset -1 represents a libertarian
answer and 1 represents an authoritarian answer. For the society dataset -1
represents a left leaning answer and 1 represents a right leaning answer.

## Samples

Posts related to the questions were found on debate.org from the "Opinions"
section. Some posts were only tangentially related, but were assumed to benefit
the dataset. For some questions no data was found. Either the "Yes" or "No"
responses were labelled based on how the question were worded and the prompt's
class. For collecting the responses the page was loaded, two scripts were run in
the browser's DevTools and the responses were pasted into Google Sheets, given
the appropriate class, and question label. The scripts used to do this were
based on the HTML classes of the site and may not work going forward. They are
provided below.

The end result was ~4,000 labelled economy samples and ~16,000 labelled society
samples.

### Yes Arguments

```javascript
console.log(
  [...document.querySelector("#yes-arguments").querySelectorAll(".hasData p")]
    .map((a) => a.innerText.replaceAll(/\s+/g, " ")).join("\n"),
);
```

### No Arguments

```javascript
console.log(
  [...document.querySelector("#no-arguments").querySelectorAll(".hasData p")]
    .map((a) => a.innerText.replaceAll(/\s+/g, " ")).join("\n"),
);
```

## Data Cleaning

1. Most spammy, unrelated, or gibberish responses were removed. It seems that
   debate.org is prone to this because they enforce a mandatory 50 word
   response. Because of this, some responses are copypasta, unrelated to the
   prompt, or are just random letters separated by spaces. If the sample was
   mostly on topic but ended with poor data, just the off-topic part was
   removed.
1. Duplicate responses were removed. The debate.org site seems to have a
   technical issue that allows duplicate responses to be recorded. Additionally
   responses with only a few words changed were removed.
1. Some arguments that only referenced the prompt implicitly were removed. This
   is because that argument could have been made for any number of prompts
   instead of a specific prompt.
1. A handful of arguments that were not in english were removed.
1. Several misclassified samples were corrected. Questions with 'illegal' or
   'legal' seemed particularly affected by misclassification - presumably
   because they are antonyms with similar spelling.
1. Some slang was corrected. For example some instances of 'u' was replaced with
   'you'.
1. Some acronyms were replaced. For example depending on how a sentence is
   vectorized "US" (referring to the United States) would be indistinguishable
   from "us" (referring to him or herself and others). Some acronyms such as
   "U.N." were replaced with "United Nations" because the specific tokenizer
   used would treat "." as a space and would only tokenize words of two or more
   characters. Thus, "U.N." would be completely discarded by the tokenization
   process.
1. Some text that was considered too unique to provide insight was removed.
   Examples include numbering, urls, emojis, and hashtags.
1. Google sheets spell check was used to replace most spelling errors. This
   wasn't able to correct certain spelling errors.

## Testing Data

For each dataset an assortment of samples was removed from the training data to
be used for testing. An equal number was taken for each class. Additionally,
they were equally divided among the question prompts that contained enough data
to allow for removing some. They were chosen from samples that seemed to
represent their question-target pair as a whole. This was also done to avoid
accidentally testing a model on a sample that was misclassified or contained no
information.
