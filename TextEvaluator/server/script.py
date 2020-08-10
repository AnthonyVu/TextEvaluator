import json
from collections import OrderedDict
from operator import itemgetter

f = open('data.json', 'r')
data = json.loads(f.read())

# https://stackoverflow.com/questions/8287000/get-first-n-key-pairs-from-an-ordered-dictionary-to-another-one
nouns = OrderedDict(sorted(data['nouns'].items(), key=itemgetter(1), reverse=True))
adjectives = OrderedDict(sorted(data['adjectives'].items(), key=itemgetter(1), reverse=True))
verbs = OrderedDict(sorted(data['verbs'].items(), key=itemgetter(1), reverse=True))
adverbs = OrderedDict(sorted(data['adverbs'].items(), key=itemgetter(1), reverse=True))
merged = OrderedDict(sorted(data['merged'].items(), key=itemgetter(1), reverse=True))
# change the value later

count = 100 
nouns = dict(nouns.items()[:count])
adjectives = dict(adjectives.items()[:count])
verbs = dict(verbs.items()[:count])
adverbs = dict(adverbs.items()[:count])
merged = dict(merged.items()[:count*10])

data = dict()

data['nouns'] = nouns 
data['adjectives'] = adjectives
data['verbs'] = verbs
data['adverbs'] = adverbs
data['merged'] = merged

# https://stackoverflow.com/questions/17043860/how-to-dump-a-dict-to-a-json-file
with open('result.json', 'w') as fp:
    json.dump(data, fp)

f.close()