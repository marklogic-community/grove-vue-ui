import { polyfill } from 'es6-promise';
import 'isomorphic-fetch';

polyfill();

export default {
  name: 'ValuesApi',

  getValues(name, params, options, searchState, qtext, facetObject) {
    //get options
    return fetch('/v1/config/query/all?format=json', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      credentials: 'same-origin'
    }).then(
      response => {
        return response.json().then(function(json) {
          let options = json.options || {};

          let path = '';
          let collation = '';
          for (let i=0; i < options.constraint.length; i++) {
            if (options.constraint[i].name === name){
              path = options.constraint[i].range['path-index'].text;
              collation = options.constraint[i].range.collation;
            }
          }

          options.values = {
            name: name,
            range: {
              collation: collation,
              type: 'xs:string',
              'path-index': {
                text: path,
                ns: ''
              }
            },
            'values-option' : ['frequency-order']
          };
          //combine with search
          let searchType = 'all';
          // let searchType = searchType !== undefined ? searchType : 'all';
          let start = facetObject.facetValues.length +1 || 1;
          // let start = 1;
          let pageLength = 10;
          // var limit = 100;
          var limit = start + pageLength - 1;

          let facets = Object.keys(searchState.activeFacets || {}).map(function(facetName) {
            let constraintType = searchState.activeFacets[facetName].type;
            if (constraintType && constraintType.substring(0, 3) === 'xs:') {
              constraintType = 'range';
            }
            let temp = {
              'range-constraint-query' :{
                'constraint-name': facetName,
                constraintType: constraintType
              }
            };
            searchState.activeFacets[facetName].values.map(function(facetValue) {
              temp.value = [facetValue.value];
              if (facetValue.negated) {
                temp['range-operator'] = 'NE';
              }
            });

            return temp;
          });
          let valuesParams = new URLSearchParams();
          valuesParams.append('q', qtext);
          valuesParams.append('start', start);
          valuesParams.append('pageLength', pageLength);
          valuesParams.append('limit', limit);
          valuesParams.append('direction', 'descending');
          let valuesParamsString = valuesParams.toString();

          return fetch('/v1/values/' + name + '?'+valuesParamsString, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify({
              search: {
                query: {
                  queries: {
                    and: [].concat(facets)
                  }},
                options: options
            }}),
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
        });
      },
      error => {
        return error;
      }
    );
  }
};
