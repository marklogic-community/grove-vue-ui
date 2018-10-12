import { polyfill } from 'es6-promise';
import 'isomorphic-fetch';

polyfill();

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
  }
};
