import { polyfill } from 'es6-promise';
import 'isomorphic-fetch';

polyfill();

// copied from AngularJS
function isObject(value) {
  // http://jsperf.com/isobject4
  return value !== null && typeof value === 'object';
}

function hasHighlights(node) {
  if (Array.isArray(node)) {
    return (
      node.filter(item => {
        return hasHighlights(item);
      }, this).length > 0
    );
  } else if (isObject(node)) {
    return (
      Object.keys(node).filter(key => {
        if (key === 'highlight') {
          return true;
        } else {
          return hasHighlights(node[key]);
        }
      }, this).length > 0
    );
  } else {
    return false;
  }
}

export default {
  name: 'SearchApi',

  getFacets(searchType, qtext, activeFacets) {
    searchType = searchType !== undefined ? searchType : 'all';
    qtext = qtext !== undefined ? qtext : '';

    var facets = Object.keys(activeFacets || {}).map(function(facetName) {
      var constraintType = activeFacets[facetName].type;
      if (constraintType && constraintType.substring(0, 3) === 'xs:') {
        constraintType = 'range';
      }
      return {
        type: 'selection',
        constraint: facetName,
        constraintType: constraintType,
        mode: 'and',
        value: activeFacets[facetName].values.map(function(facetValue) {
          if (facetValue.negated) {
            return { not: facetValue.value };
          } else {
            return facetValue.value;
          }
        })
      };
    });

    return fetch('/api/search/' + searchType, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        filters: {
          and: [
            {
              type: 'queryText',
              value: qtext
            }
          ].concat(facets)
        },
        options: {
          start: 1,
          pageLength: 0
        }
      }),
      credentials: 'same-origin'
    }).then(
      response => {
        return response.json().then(function(json) {
          return { response: json };
        });
      },
      error => {
        return error;
      }
    );
  },
  getResults(searchType, qtext, activeFacets, start, pageLength) {
    searchType = searchType !== undefined ? searchType : 'all';
    qtext = qtext !== undefined ? qtext : '';
    start = start || 1;
    pageLength = pageLength || 10;

    var facets = Object.keys(activeFacets || {}).map(function(facetName) {
      var constraintType = activeFacets[facetName].type;
      if (constraintType && constraintType.substring(0, 3) === 'xs:') {
        constraintType = 'range';
      }
      return {
        type: 'selection',
        constraint: facetName,
        constraintType: constraintType,
        mode: 'and',
        value: activeFacets[facetName].values.map(function(facetValue) {
          if (facetValue.negated) {
            return { not: facetValue.value };
          } else {
            return facetValue.value;
          }
        })
      };
    });

    return fetch('/api/search/' + searchType, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        filters: {
          and: [
            {
              type: 'queryText',
              value: qtext
            }
          ].concat(facets)
        },
        options: {
          start: start,
          pageLength: pageLength
        }
      }),
      credentials: 'same-origin'
    }).then(
      response => {
        return response.json().then(function(json) {
          if (json.results && json.results.length) {
            json.results.forEach(result => {
              if (
                result.extracted &&
                result.extracted.content &&
                result.extracted.content.length
              ) {
                result.extracted.content.forEach(content => {
                  if (Array.isArray(content)) {
                    // should not occur?
                  } else if (isObject(content)) {
                    Object.keys(content).forEach(key => {
                      var val = content[key];
                      if (result.content[key] !== undefined) {
                        if (!Array.isArray(result.content[key])) {
                          result.content[key] = [result.content[key]];
                        }
                        result.content[key].push(val);
                      } else {
                        result.content[key] = val;
                      }
                    }, this);
                  } else {
                    // should not occur?
                  }
                }, this);
              }
              if (result.matches) {
                result.hasHighlights = hasHighlights(result.matches);
              }
            }, this);
          }
          return { response: json };
        });
      },
      error => {
        return error;
      }
    );
  },
  suggest(searchType, ptext, activeFacets) {
    searchType = searchType !== undefined ? searchType : 'all';
    ptext = ptext !== undefined ? ptext : '';

    /*var facets =*/ Object.keys(activeFacets || {}).map(function(facetName) {
      var constraintType = activeFacets[facetName].type;
      if (constraintType && constraintType.substring(0, 3) === 'xs:') {
        constraintType = 'range';
      }
      return {
        type: 'selection',
        constraint: facetName,
        constraintType: constraintType,
        mode: 'and',
        value: activeFacets[facetName].values.map(function(facetValue) {
          if (facetValue.negated) {
            return { not: facetValue.value };
          } else {
            return facetValue.value;
          }
        })
      };
    });

    // TODO: expose /api/search/{type}/suggest in middle-tier, and call that
    //       as /v1/suggest doesn't understand search filters
    return fetch(
      '/v1/suggest?options=' +
        searchType +
        '&partial-q=' +
        encodeURIComponent(ptext),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        credentials: 'same-origin'
      }
    ).then(
      response => {
        return response.json().then(function(json) {
          return json;
        });
      },
      error => {
        return error;
      }
    );
  },
  getSimilar(uri) {
    let custom = {
      "query": {
        "queries": [{
          "custom-constraint-query": {
            "constraint-name": "similar",
            "text": uri
          }
        }]
      }
    };

    return fetch('/api/search/similar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(custom),
      credentials: 'same-origin'
    }).then(
      response => {
        return response.json().then(function(json) {
          return { response: json };
        });
      },
      error => {
        return error;
      }
    );
  }
};
