/**
 * Moving Pixel Perfect Typo v1.0.0 - Design workshop. Helllostar is backed by the Bangladesh University of Business and Technology (BUBT).
 * @link https://helllostar.github.io/moving-pixel-perfect-typo
 * @copyright 2015-2016 Zafree
 * @license MIT
 */
// Reference Javascript Porter Stemmer. This code corresponds to the original
// 1980 paper available here: http://tartarus.org/martin/PorterStemmer/def.txt
// The latest version of this code is available at https://github.com/kristopolous/Porter-Stemmer
//
// Original comment:
// Porter stemmer in Javascript. Few comments, but it's easy to follow against the rules in the original
// paper, in
//
//  Porter, 1980, An algorithm for suffix stripping, Program, Vol. 14,
//  no. 3, pp 130-137,
//
// see also http://www.tartarus.org/~martin/PorterStemmer

var stemmer = (function(){
  var step2list = {
      "ational" : "ate",
      "tional" : "tion",
      "enci" : "ence",
      "anci" : "ance",
      "izer" : "ize",
      "bli" : "ble",
      "alli" : "al",
      "entli" : "ent",
      "eli" : "e",
      "ousli" : "ous",
      "ization" : "ize",
      "ation" : "ate",
      "ator" : "ate",
      "alism" : "al",
      "iveness" : "ive",
      "fulness" : "ful",
      "ousness" : "ous",
      "aliti" : "al",
      "iviti" : "ive",
      "biliti" : "ble",
      "logi" : "log"
    },

    step3list = {
      "icate" : "ic",
      "ative" : "",
      "alize" : "al",
      "iciti" : "ic",
      "ical" : "ic",
      "ful" : "",
      "ness" : ""
    },

    c = "[^aeiou]",          // consonant
    v = "[aeiouy]",          // vowel
    C = c + "[^aeiouy]*",    // consonant sequence
    V = v + "[aeiou]*",      // vowel sequence

    mgr0 = "^(" + C + ")?" + V + C,               // [C]VC... is m>0
    meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$",  // [C]VC[V] is m=1
    mgr1 = "^(" + C + ")?" + V + C + V + C,       // [C]VCVC... is m>1
    s_v = "^(" + C + ")?" + v;                   // vowel in stem

  function dummyDebug() {}

  function realDebug() {
    console.log(Array.prototype.slice.call(arguments).join(' '));
  }

  return function (w, debug) {
    var
      stem,
      suffix,
      firstch,
      re,
      re2,
      re3,
      re4,
      debugFunction,
      origword = w;

    if (debug) {
      debugFunction = realDebug;
    } else {
      debugFunction = dummyDebug;
    }

    if (w.length < 3) { return w; }

    firstch = w.substr(0,1);
    if (firstch == "y") {
      w = firstch.toUpperCase() + w.substr(1);
    }

    // Step 1a
    re = /^(.+?)(ss|i)es$/;
    re2 = /^(.+?)([^s])s$/;

    if (re.test(w)) {
      w = w.replace(re,"$1$2");
      debugFunction('1a',re, w);

    } else if (re2.test(w)) {
      w = w.replace(re2,"$1$2");
      debugFunction('1a',re2, w);
    }

    // Step 1b
    re = /^(.+?)eed$/;
    re2 = /^(.+?)(ed|ing)$/;
    if (re.test(w)) {
      var fp = re.exec(w);
      re = new RegExp(mgr0);
      if (re.test(fp[1])) {
        re = /.$/;
        w = w.replace(re,"");
        debugFunction('1b',re, w);
      }
    } else if (re2.test(w)) {
      var fp = re2.exec(w);
      stem = fp[1];
      re2 = new RegExp(s_v);
      if (re2.test(stem)) {
        w = stem;
        debugFunction('1b', re2, w);

        re2 = /(at|bl|iz)$/;
        re3 = new RegExp("([^aeiouylsz])\\1$");
        re4 = new RegExp("^" + C + v + "[^aeiouwxy]$");

        if (re2.test(w)) {
          w = w + "e";
          debugFunction('1b', re2, w);

        } else if (re3.test(w)) {
          re = /.$/;
          w = w.replace(re,"");
          debugFunction('1b', re3, w);

        } else if (re4.test(w)) {
          w = w + "e";
          debugFunction('1b', re4, w);
        }
      }
    }

    // Step 1c
    re = new RegExp("^(.*" + v + ".*)y$");
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      w = stem + "i";
      debugFunction('1c', re, w);
    }

    // Step 2
    re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = new RegExp(mgr0);
      if (re.test(stem)) {
        w = stem + step2list[suffix];
        debugFunction('2', re, w);
      }
    }

    // Step 3
    re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = new RegExp(mgr0);
      if (re.test(stem)) {
        w = stem + step3list[suffix];
        debugFunction('3', re, w);
      }
    }

    // Step 4
    re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
    re2 = /^(.+?)(s|t)(ion)$/;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = new RegExp(mgr1);
      if (re.test(stem)) {
        w = stem;
        debugFunction('4', re, w);
      }
    } else if (re2.test(w)) {
      var fp = re2.exec(w);
      stem = fp[1] + fp[2];
      re2 = new RegExp(mgr1);
      if (re2.test(stem)) {
        w = stem;
        debugFunction('4', re2, w);
      }
    }

    // Step 5
    re = /^(.+?)e$/;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = new RegExp(mgr1);
      re2 = new RegExp(meq1);
      re3 = new RegExp("^" + C + v + "[^aeiouwxy]$");
      if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
        w = stem;
        debugFunction('5', re, re2, re3, w);
      }
    }

    re = /ll$/;
    re2 = new RegExp(mgr1);
    if (re.test(w) && re2.test(w)) {
      re = /.$/;
      w = w.replace(re,"");
      debugFunction('5', re, re2, w);
    }

    // and turn initial Y back to y
    if (firstch == "y") {
      w = firstch.toLowerCase() + w.substr(1);
    }


    return w;
  }
})();

/// <reference path="index-strategy.ts" />
var JsSearch;
(function (JsSearch) {
    var AllSubstringsIndexStrategy = (function () {
        function AllSubstringsIndexStrategy() {
        }
        AllSubstringsIndexStrategy.prototype.expandToken = function (token) {
            var expandedTokens = [];
            for (var i = 0, length = token.length; i < length; ++i) {
                var prefixString = '';
                for (var j = i; j < length; ++j) {
                    prefixString += token.charAt(j);
                    expandedTokens.push(prefixString);
                }
            }
            return expandedTokens;
        };
        return AllSubstringsIndexStrategy;
    })();
    JsSearch.AllSubstringsIndexStrategy = AllSubstringsIndexStrategy;
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=all-substrings-index-strategy.js.map
/// <reference path="index-strategy.ts" />
var JsSearch;
(function (JsSearch) {
    var ExactWordIndexStrategy = (function () {
        function ExactWordIndexStrategy() {
        }
        ExactWordIndexStrategy.prototype.expandToken = function (token) {
            return token ? [token] : [];
        };
        return ExactWordIndexStrategy;
    })();
    JsSearch.ExactWordIndexStrategy = ExactWordIndexStrategy;
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=exact-word-index-strategy.js.map
var JsSearch;
(function (JsSearch) {
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=index-strategy.js.map
/// <reference path="index-strategy.ts" />
var JsSearch;
(function (JsSearch) {
    var PrefixIndexStrategy = (function () {
        function PrefixIndexStrategy() {
        }
        PrefixIndexStrategy.prototype.expandToken = function (token) {
            var expandedTokens = [];
            var prefixString = '';
            for (var i = 0, length = token.length; i < length; ++i) {
                prefixString += token.charAt(i);
                expandedTokens.push(prefixString);
            }
            return expandedTokens;
        };
        return PrefixIndexStrategy;
    })();
    JsSearch.PrefixIndexStrategy = PrefixIndexStrategy;
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=prefix-index-strategy.js.map
/// <reference path="sanitizer.ts" />
var JsSearch;
(function (JsSearch) {
    var CaseSensitiveSanitizer = (function () {
        function CaseSensitiveSanitizer() {
        }
        CaseSensitiveSanitizer.prototype.sanitize = function (text) {
            return text ? text.trim() : '';
        };
        return CaseSensitiveSanitizer;
    })();
    JsSearch.CaseSensitiveSanitizer = CaseSensitiveSanitizer;
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=case-sensitive-sanitizer.js.map
/// <reference path="sanitizer.ts" />
var JsSearch;
(function (JsSearch) {
    var LowerCaseSanitizer = (function () {
        function LowerCaseSanitizer() {
        }
        LowerCaseSanitizer.prototype.sanitize = function (text) {
            return text ? text.toLocaleLowerCase().trim() : '';
        };
        return LowerCaseSanitizer;
    })();
    JsSearch.LowerCaseSanitizer = LowerCaseSanitizer;
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=lower-case-sanitizer.js.map
var JsSearch;
(function (JsSearch) {
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=sanitizer.js.map
var JsSearch;
(function (JsSearch) {
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=search-index.js.map
/// <reference path="search-index.ts" />
var JsSearch;
(function (JsSearch) {
    var TfIdfSearchIndex = (function () {
        function TfIdfSearchIndex(uidFieldName) {
            this.uidFieldName_ = uidFieldName;
            this.tokenToIdfCache_ = {};
            this.tokenMap_ = {};
        }
        TfIdfSearchIndex.prototype.indexDocument = function (token, uid, document) {
            this.tokenToIdfCache_ = {};
            if (!this.tokenMap_[token]) {
                this.tokenMap_[token] = {
                    $numDocumentOccurrences: 0,
                    $totalNumOccurrences: 1,
                    $uidMap: {}
                };
            }
            else {
                this.tokenMap_[token].$totalNumOccurrences++;
            }
            if (!this.tokenMap_[token].$uidMap[uid]) {
                this.tokenMap_[token].$numDocumentOccurrences++;
                this.tokenMap_[token].$uidMap[uid] = {
                    $document: document,
                    $numTokenOccurrences: 1
                };
            }
            else {
                this.tokenMap_[token].$uidMap[uid].$numTokenOccurrences++;
            }
        };
        TfIdfSearchIndex.prototype.search = function (tokens, corpus) {
            var uidToDocumentMap = {};
            for (var i = 0, numTokens = tokens.length; i < numTokens; i++) {
                var token = tokens[i];
                var tokenMetadata = this.tokenMap_[token];
                if (!tokenMetadata) {
                    return [];
                }
                if (i === 0) {
                    for (var uid in tokenMetadata.$uidMap) {
                        uidToDocumentMap[uid] = tokenMetadata.$uidMap[uid].$document;
                    }
                }
                else {
                    for (var uid in uidToDocumentMap) {
                        if (!tokenMetadata.$uidMap[uid]) {
                            delete uidToDocumentMap[uid];
                        }
                    }
                }
            }
            var documents = [];
            for (var uid in uidToDocumentMap) {
                documents.push(uidToDocumentMap[uid]);
            }
            return documents.sort(function (documentA, documentB) {
                return this.calculateTfIdf_(tokens, documentB, corpus) -
                    this.calculateTfIdf_(tokens, documentA, corpus);
            }.bind(this));
        };
        TfIdfSearchIndex.prototype.calculateIdf_ = function (token, documents) {
            if (!this.tokenToIdfCache_[token]) {
                var numDocumentsWithToken = this.tokenMap_[token] && this.tokenMap_[token].$numDocumentOccurrences || 0;
                this.tokenToIdfCache_[token] = 1 + Math.log(documents.length / (1 + numDocumentsWithToken));
            }
            return this.tokenToIdfCache_[token];
        };
        TfIdfSearchIndex.prototype.calculateTfIdf_ = function (tokens, document, documents) {
            var score = 0;
            for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
                var token = tokens[i];
                var inverseDocumentFrequency = this.calculateIdf_(token, documents);
                if (inverseDocumentFrequency === Infinity) {
                    inverseDocumentFrequency = 0;
                }
                var uid = document && document[this.uidFieldName_];
                var termFrequency = this.tokenMap_[token] &&
                    this.tokenMap_[token].$uidMap[uid] &&
                    this.tokenMap_[token].$uidMap[uid].$numTokenOccurrences || 0;
                score += termFrequency * inverseDocumentFrequency;
            }
            return score;
        };
        return TfIdfSearchIndex;
    })();
    JsSearch.TfIdfSearchIndex = TfIdfSearchIndex;
    ;
    ;
    ;
    ;
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=tf-idf-search-index.js.map
/// <reference path="search-index.ts" />
var JsSearch;
(function (JsSearch) {
    var UnorderedSearchIndex = (function () {
        function UnorderedSearchIndex() {
            this.tokenToUidToDocumentMap_ = {};
        }
        UnorderedSearchIndex.prototype.indexDocument = function (token, uid, document) {
            if (!this.tokenToUidToDocumentMap_[token]) {
                this.tokenToUidToDocumentMap_[token] = {};
            }
            this.tokenToUidToDocumentMap_[token][uid] = document;
        };
        UnorderedSearchIndex.prototype.search = function (tokens, corpus) {
            var uidToDocumentMap = {};
            for (var i = 0, numTokens = tokens.length; i < numTokens; i++) {
                var token = tokens[i];
                var currentUidToDocumentMap = this.tokenToUidToDocumentMap_[token] || {};
                if (i === 0) {
                    for (var uid in currentUidToDocumentMap) {
                        uidToDocumentMap[uid] = currentUidToDocumentMap[uid];
                    }
                }
                else {
                    for (var uid in uidToDocumentMap) {
                        if (!currentUidToDocumentMap[uid]) {
                            delete uidToDocumentMap[uid];
                        }
                    }
                }
            }
            var documents = [];
            for (var uid in uidToDocumentMap) {
                documents.push(uidToDocumentMap[uid]);
            }
            return documents;
        };
        return UnorderedSearchIndex;
    })();
    JsSearch.UnorderedSearchIndex = UnorderedSearchIndex;
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=unordered-search-index.js.map
/// <reference path="index-strategy/index-strategy.ts" />
/// <reference path="index-strategy/prefix-index-strategy.ts" />
/// <reference path="sanitizer/lower-case-sanitizer.ts" />
/// <reference path="sanitizer/sanitizer.ts" />
/// <reference path="search-index/search-index.ts" />
/// <reference path="search-index/tf-idf-search-index.ts" />
/// <reference path="tokenizer/simple-tokenizer.ts" />
/// <reference path="tokenizer/tokenizer.ts" />
var JsSearch;
(function (JsSearch) {
    var Search = (function () {
        function Search(uidFieldName) {
            this.uidFieldName_ = uidFieldName;
            this.indexStrategy_ = new JsSearch.PrefixIndexStrategy();
            this.searchIndex_ = new JsSearch.TfIdfSearchIndex(uidFieldName);
            this.sanitizer_ = new JsSearch.LowerCaseSanitizer();
            this.tokenizer_ = new JsSearch.SimpleTokenizer();
            this.documents_ = [];
            this.searchableFields = [];
        }
        Object.defineProperty(Search.prototype, "indexStrategy", {
            get: function () {
                return this.indexStrategy_;
            },
            set: function (value) {
                if (this.initialized_) {
                    throw Error('IIndexStrategy cannot be set after initialization');
                }
                this.indexStrategy_ = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Search.prototype, "sanitizer", {
            get: function () {
                return this.sanitizer_;
            },
            set: function (value) {
                if (this.initialized_) {
                    throw Error('ISanitizer cannot be set after initialization');
                }
                this.sanitizer_ = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Search.prototype, "searchIndex", {
            get: function () {
                return this.searchIndex_;
            },
            set: function (value) {
                if (this.initialized_) {
                    throw Error('ISearchIndex cannot be set after initialization');
                }
                this.searchIndex_ = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Search.prototype, "tokenizer", {
            get: function () {
                return this.tokenizer_;
            },
            set: function (value) {
                if (this.initialized_) {
                    throw Error('ITokenizer cannot be set after initialization');
                }
                this.tokenizer_ = value;
            },
            enumerable: true,
            configurable: true
        });
        Search.prototype.addDocument = function (document) {
            this.addDocuments([document]);
        };
        Search.prototype.addDocuments = function (documents) {
            this.documents_.push.apply(this.documents_, documents);
            this.indexDocuments_(documents, this.searchableFields);
        };
        Search.prototype.addIndex = function (field) {
            this.searchableFields.push(field);
            this.indexDocuments_(this.documents_, [field]);
        };
        Search.prototype.search = function (query) {
            var tokens = this.tokenizer_.tokenize(this.sanitizer_.sanitize(query));
            return this.searchIndex_.search(tokens, this.documents_);
        };
        Search.prototype.indexDocuments_ = function (documents, searchableFields) {
            this.initialized_ = true;
            for (var di = 0, numDocuments = documents.length; di < numDocuments; di++) {
                var document = documents[di];
                var uid = document[this.uidFieldName_];
                for (var sfi = 0, numSearchableFields = searchableFields.length; sfi < numSearchableFields; sfi++) {
                    var fieldValue;
                    var searchableField = searchableFields[sfi];
                    if (searchableField instanceof Array) {
                        fieldValue = Search.getNestedFieldValue(document, searchableField);
                    }
                    else {
                        fieldValue = document[searchableField];
                    }
                    if (fieldValue != null &&
                        typeof fieldValue !== 'string' &&
                        fieldValue.toString) {
                        fieldValue = fieldValue.toString();
                    }
                    if (typeof fieldValue === 'string') {
                        var fieldTokens = this.tokenizer_.tokenize(this.sanitizer_.sanitize(fieldValue));
                        for (var fti = 0, numFieldValues = fieldTokens.length; fti < numFieldValues; fti++) {
                            var fieldToken = fieldTokens[fti];
                            var expandedTokens = this.indexStrategy_.expandToken(fieldToken);
                            for (var eti = 0, nummExpandedTokens = expandedTokens.length; eti < nummExpandedTokens; eti++) {
                                var expandedToken = expandedTokens[eti];
                                this.searchIndex_.indexDocument(expandedToken, uid, document);
                            }
                        }
                    }
                }
            }
        };
        Search.getNestedFieldValue = function (object, path) {
            path = path || [];
            object = object || {};
            var value = object;
            for (var i = 0; i < path.length; i++) {
                value = value[path[i]];
                if (value == null) {
                    return null;
                }
            }
            return value;
        };
        return Search;
    })();
    JsSearch.Search = Search;
})(JsSearch || (JsSearch = {}));
//# sourceMappingURL=search.js.map
var JsSearch;
(function (JsSearch) {
    JsSearch.StopWordsMap = {
        a: 'a',
        able: 'able',
        about: 'about',
        across: 'across',
        after: 'after',
        all: 'all',
        almost: 'almost',
        also: 'also',
        am: 'am',
        among: 'among',
        an: 'an',
        and: 'and',
        any: 'any',
        are: 'are',
        as: 'as',
        at: 'at',
        be: 'be',
        because: 'because',
        been: 'been',
        but: 'but',
        by: 'by',
        can: 'can',
        cannot: 'cannot',
        could: 'could',
        dear: 'dear',
        did: 'did',
        do: 'do',
        does: 'does',
        either: 'either',
        else: 'else',
        ever: 'ever',
        every: 'every',
        for: 'for',
        from: 'from',
        get: 'get',
        got: 'got',
        had: 'had',
        has: 'has',
        have: 'have',
        he: 'he',
        her: 'her',
        hers: 'hers',
        him: 'him',
        his: 'his',
        how: 'how',
        however: 'however',
        i: 'i',
        if: 'if',
        in: 'in',
        into: 'into',
        is: 'is',
        it: 'it',
        its: 'its',
        just: 'just',
        least: 'least',
        let: 'let',
        like: 'like',
        likely: 'likely',
        may: 'may',
        me: 'me',
        might: 'might',
        most: 'most',
        must: 'must',
        my: 'my',
        neither: 'neither',
        no: 'no',
        nor: 'nor',
        not: 'not',
        of: 'of',
        off: 'off',
        often: 'often',
        on: 'on',
        only: 'only',
        or: 'or',
        other: 'other',
        our: 'our',
        own: 'own',
        rather: 'rather',
        said: 'said',
        say: 'say',
        says: 'says',
        she: 'she',
        should: 'should',
        since: 'since',
        so: 'so',
        some: 'some',
        than: 'than',
        that: 'that',
        the: 'the',
        their: 'their',
        them: 'them',
        then: 'then',
        there: 'there',
        these: 'these',
        they: 'they',
        this: 'this',
        tis: 'tis',
        to: 'to',
        too: 'too',
        twas: 'twas',
        us: 'us',
        wants: 'wants',
        was: 'was',
        we: 'we',
        were: 'were',
        what: 'what',
        when: 'when',
        where: 'where',
        which: 'which',
        while: 'while',
        who: 'who',
        whom: 'whom',
        why: 'why',
        will: 'will',
        with: 'with',
        would: 'would',
        yet: 'yet',
        you: 'you',
        your: 'your'
    };
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=stop-words-map.js.map
var JsSearch;
(function (JsSearch) {
    var TokenHighlighter = (function () {
        function TokenHighlighter(opt_indexStrategy, opt_sanitizer, opt_wrapperTagName) {
            this.indexStrategy_ = opt_indexStrategy || new JsSearch.PrefixIndexStrategy();
            this.sanitizer_ = opt_sanitizer || new JsSearch.LowerCaseSanitizer();
            this.wrapperTagName_ = opt_wrapperTagName || 'mark';
        }
        TokenHighlighter.prototype.highlight = function (text, tokens) {
            var tagsLength = this.wrapText_('').length;
            var tokenDictionary = {};
            for (var i = 0, numTokens = tokens.length; i < numTokens; i++) {
                var token = this.sanitizer_.sanitize(tokens[i]);
                var expandedTokens = this.indexStrategy_.expandToken(token);
                for (var j = 0, numExpandedTokens = expandedTokens.length; j < numExpandedTokens; j++) {
                    var expandedToken = expandedTokens[j];
                    if (!tokenDictionary[expandedToken]) {
                        tokenDictionary[expandedToken] = [token];
                    }
                    else {
                        tokenDictionary[expandedToken].push(token);
                    }
                }
            }
            var actualCurrentWord = '';
            var sanitizedCurrentWord = '';
            var currentWordStartIndex = 0;
            for (var i = 0, textLength = text.length; i < textLength; i++) {
                var character = text.charAt(i);
                if (character === ' ') {
                    actualCurrentWord = '';
                    sanitizedCurrentWord = '';
                    currentWordStartIndex = i + 1;
                }
                else {
                    actualCurrentWord += character;
                    sanitizedCurrentWord += this.sanitizer_.sanitize(character);
                }
                if (tokenDictionary[sanitizedCurrentWord] &&
                    tokenDictionary[sanitizedCurrentWord].indexOf(sanitizedCurrentWord) >= 0) {
                    actualCurrentWord = this.wrapText_(actualCurrentWord);
                    text = text.substring(0, currentWordStartIndex) + actualCurrentWord + text.substring(i + 1);
                    i += tagsLength;
                    textLength += tagsLength;
                }
            }
            return text;
        };
        TokenHighlighter.prototype.wrapText_ = function (text) {
            return "<" + this.wrapperTagName_ + ">" + text + "</" + this.wrapperTagName_ + ">";
        };
        return TokenHighlighter;
    })();
    JsSearch.TokenHighlighter = TokenHighlighter;
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=token-highlighter.js.map
/// <reference path="tokenizer.ts" />
var JsSearch;
(function (JsSearch) {
    var SimpleTokenizer = (function () {
        function SimpleTokenizer() {
        }
        SimpleTokenizer.prototype.tokenize = function (text) {
            return text.split(/[^a-zA-Z0-9\-']+/)
                .filter(function (text) {
                return !!text;
            });
        };
        return SimpleTokenizer;
    })();
    JsSearch.SimpleTokenizer = SimpleTokenizer;
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=simple-tokenizer.js.map
/// <reference path="tokenizer.ts" />
var JsSearch;
(function (JsSearch) {
    var StemmingTokenizer = (function () {
        function StemmingTokenizer(stemmingFunction, decoratedTokenizer) {
            this.stemmingFunction_ = stemmingFunction;
            this.tokenizer_ = decoratedTokenizer;
        }
        StemmingTokenizer.prototype.tokenize = function (text) {
            return this.tokenizer_.tokenize(text)
                .map(function (token) {
                return this.stemmingFunction_(token);
            }, this);
        };
        return StemmingTokenizer;
    })();
    JsSearch.StemmingTokenizer = StemmingTokenizer;
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=stemming-tokenizer.js.map
/// <reference path="tokenizer.ts" />
var JsSearch;
(function (JsSearch) {
    var StopWordsTokenizer = (function () {
        function StopWordsTokenizer(decoratedTokenizer) {
            this.tokenizer_ = decoratedTokenizer;
        }
        StopWordsTokenizer.prototype.tokenize = function (text) {
            return this.tokenizer_.tokenize(text)
                .filter(function (token) {
                return token && JsSearch.StopWordsMap[token] !== token;
            });
        };
        return StopWordsTokenizer;
    })();
    JsSearch.StopWordsTokenizer = StopWordsTokenizer;
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=stop-words-filtering-tokenizer.js.map
var JsSearch;
(function (JsSearch) {
    ;
})(JsSearch || (JsSearch = {}));
;
//# sourceMappingURL=tokenizer.js.map
(function (JsSearch) {
  if (typeof module !== 'undefined' && module.exports && JsSearch) { module.exports = JsSearch; }
})(JsSearch || (JsSearch = {}));

// ;(function() {
//     'use strict';
//
//     // set progressive image loading
//     var progressiveMedias = document.querySelectorAll('.progressiveMedia');
//     for (var i = 0; i < progressiveMedias.length; i++) {
//         loadImage(progressiveMedias[i]);
//     }
//
//     // global function
//     function loadImage(progressiveMedia) {
//
//         // calculate aspect ratio
//         // for the aspectRatioPlaceholder-fill
//         // that helps to set a fixed fill for loading images
//         var width = progressiveMedia.dataset.width,
//         height = progressiveMedia.dataset.height,
//         fill = height / width * 100,
//         placeholderFill = progressiveMedia.previousElementSibling;
//
//         placeholderFill.setAttribute('style', 'padding-bottom:'+fill+'%;');
//
//
//         // set max-height and max-width to aspectRatioPlaceholder
//         // that is fun
//         var aspectRatioPlaceholder = progressiveMedia.parentElement,
//         maxWidth = aspectRatioPlaceholder.offsetWidth,
//         maxHeight = aspectRatioPlaceholder.offsetHeight;
//
//         aspectRatioPlaceholder.setAttribute('style', 'max-width:'+maxWidth+'px; max-height:'+maxHeight+'px;');
//
//
//         // get thumbnail height wight
//         // make canvas fun part
//         var thumbnail = progressiveMedia.querySelector('.progressiveMedia-thumbnail'),
//         smImageWidth = thumbnail.width,
//         smImageheight = thumbnail.height,
//
//         canvas = progressiveMedia.querySelector('.progressiveMedia-canvas'),
//         context = canvas.getContext('2d');
//
//         canvas.height = smImageheight;
//         canvas.width = smImageWidth;
//
//         var img = new Image();
//         img.src = thumbnail.src;
//
//         img.onload = function () {
//             // context.drawImage(img, 0, 0);
//             // draw canvas
//             var canvasImage = new CanvasImage(canvas, img);
//             canvasImage.blur(2);
//
//             // load canvas visible
//             progressiveMedia.classList.add('is-canvasLoaded');
//         };
//
//
//         // grab data-src from original image
//         // from progressiveMedia-image
//         var lgImage = progressiveMedia.querySelector('.progressiveMedia-image');
//         lgImage.src = lgImage.dataset.src;
//
//         // onload image visible
//         lgImage.onload = function() {
//             progressiveMedia.classList.add('is-imageLoaded');
//         }
//     }
//
// })();
//
// // canvas blur function
// CanvasImage = function (e, t) {
//     this.image = t;
//     this.element = e;
//     e.width = t.width;
//     e.height = t.height;
//     this.context = e.getContext('2d');
//     this.context.drawImage(t, 0, 0);
// };
//
// CanvasImage.prototype = {
//     blur:function(e) {
//         this.context.globalAlpha = 0.5;
//         for(var t = -e; t <= e; t += 2) {
//             for(var n = -e; n <= e; n += 2) {
//                 this.context.drawImage(this.element, n, t);
//                 var blob = n >= 0 && t >= 0 && this.context.drawImage(this.element, -(n -1), -(t-1));
//             }
//         }
//     }
// };

;(function() {
    'use strict';

    var search, results, allStars = [];

    var hello = function() {
        search = new JsSearch.Search('serial');
        search.tokenizer = new JsSearch.StemmingTokenizer(stemmer, search.tokenizer);
        // search.tokenizer = new JsSearch.StopWordsTokenizer(search.tokenizer);
        // search.searchIndex = new JsSearch.TfIdfSearchIndex('id');
        search.addIndex('id');
        search.addIndex('name');
        search.addIndex('dept');
        search.addIndex('intake');
        search.addDocuments(allStars);
        searchStars();
    }

    var indexedStarsTable = document.getElementById('indexedStarsTable');
    var indexedStarsTBody = indexedStarsTable.tBodies[0];
    var searchInput = document.getElementById('searchInput');
    var starCountBadge = document.getElementById('starCountBadge');

    var updateStarsTable = function(stars) {
      indexedStarsTBody.innerHTML = '';

      var tokens = search.tokenizer.tokenize(searchInput.value);

      for (var i = 0, length = stars.length; i < length; i++) {
        var star = stars[i];

        var serialColumn = document.createElement('td');
        serialColumn.innerText = star.serial;

        var nameColumn = document.createElement('td');
        nameColumn.innerHTML = star.name;

        var idColumn = document.createElement('td');
        idColumn.innerHTML = star.id;

        var deptColumn = document.createElement('td');
        deptColumn.innerHTML = star.dept;

        var intakeColumn = document.createElement('td');
        intakeColumn.innerHTML = star.intake;


        var tableRow = document.createElement('tr');
        tableRow.appendChild(serialColumn);
        // tableRow.appendChild(idColumn);
        tableRow.appendChild(nameColumn);
        tableRow.appendChild(deptColumn);
        tableRow.appendChild(intakeColumn);

        indexedStarsTBody.appendChild(tableRow);
      }
    };

    var updateStarCountAndTable = function() {
      updateStarCount(results.length);

      if (results.length > 0) {
        updateStarsTable(results);
      } else if (!!searchInput.value) {
        updateStarsTable([]);
      } else {
        updateStarCount(allStars.length);
        updateStarsTable(allStars);
      }
    };

    var searchStars = function() {
      results = search.search(searchInput.value);
      updateStarCountAndTable();
    };

    searchInput.oninput = searchStars;

    var updateStarCount = function(numStars) {
      starCountBadge.innerText = numStars;
    };

    // show / hide function
    var hideElement  = function(element) {
      element.className += ' hidden';
    };
    var showElement = function(element) {
      element.className = element.className.replace(/\s*hidden/, '');
    };

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var json = JSON.parse(xmlhttp.responseText);

        // json file array name
        allStars = json.joinStars;


        // Total Tickets
        // Avaiable
        var totalStar = document.getElementById('TotalStar');
        var avaiableTickets = document.getElementById('AvaiableTickets');

        var totalTickets = 50;
        var bookedTickets = allStars.length;
        var avaiable = totalTickets - bookedTickets;

        totalStar.innerText = bookedTickets;
        avaiableTickets.innerText = avaiable;


        updateStarCount(allStars.length);

        var loadingProgressBar = document.getElementById('loadingProgressBar');
        hideElement(loadingProgressBar);
        showElement(indexedStarsTable);

        // rebuildSearchIndex();
        hello();
        updateStarsTable(allStars);
      }
    }
    xmlhttp.open('GET', 'join.json', true);
    xmlhttp.send();


})();
