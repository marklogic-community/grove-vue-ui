import { polyfill } from 'es6-promise';
import 'isomorphic-fetch';

polyfill();

var api = '/api/crud/';

function buildUrl(path, params) {
  var url = new URL(api + path, window.location.href);
  if (params) {
    Object.keys(params).forEach(key =>
      url.searchParams.append(key, params[key])
    );
  }
  return url;
}

// copied from Angular.js
function isObject(value) {
  // http://jsperf.com/isobject4
  return value !== null && typeof value === 'object';
}

export default {
  name: 'CRUDApi',
  view(crudType, id, view, params) {
    return fetch(buildUrl(crudType + '/' + id + '/' + view, params), {
      method: 'GET',
      credentials: 'same-origin'
    }).then(
      response => {
        return response.text().then(text => {
          return { isError: false, response: text };
        });
      },
      error => {
        return { isError: true, error: error };
      }
    );
  },
  create(crudType, id, data, format, params) {
    return fetch(buildUrl(crudType + (id ? '/' + id : ''), params), {
      method: 'POST',
      headers: {
        'content-type':
          'application/' + (format === 'binary' ? 'octet-stream' : format)
      },
      body: format === 'json' ? JSON.stringify(data) : data,
      credentials: 'same-origin'
    }).then(
      response => {
        var id = response.headers.get('location');
        return response.text().then(text => {
          return { isError: false, response: text, id: id };
        });
      },
      error => {
        return { isError: true, error: error };
      }
    );
  },
  read(crudType, id, params) {
    return fetch(buildUrl(crudType + '/' + id, params), {
      method: 'GET',
      credentials: 'same-origin'
    }).then(
      response => {
        return response.text().then(text => {
          return { isError: false, response: text };
        });
      },
      error => {
        return { isError: true, error: error };
      }
    );
  },
  update(crudType, id, data, format, params) {
    return fetch(buildUrl(crudType + '/' + id, params), {
      method: 'PUT',
      headers: {
        'content-type':
          'application/' + (format === 'binary' ? 'octet-stream' : format)
      },
      body: format === 'json' ? JSON.stringify(data) : data,
      credentials: 'same-origin'
    }).then(
      response => {
        return response.text().then(text => {
          return { isError: false, response: text };
        });
      },
      error => {
        return { isError: true, error: error };
      }
    );
  },
  delete(crudType, id, params) {
    return fetch(buildUrl(crudType + '/' + id, params), {
      method: 'DELETE',
      credentials: 'same-origin'
    }).then(
      response => {
        return response.text().then(text => {
          return { isError: false, response: text };
        });
      },
      error => {
        return { isError: true, error: error };
      }
    );
  }
};
