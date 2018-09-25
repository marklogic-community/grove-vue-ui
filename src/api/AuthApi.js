import { polyfill } from 'es6-promise';
import 'isomorphic-fetch';

polyfill();

export default {
  name: 'AuthApi',

  login(user, pass) {
    return fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        username: '' + user,
        password: '' + pass
      }),
      credentials: 'same-origin'
    }).then(
      response => {
        if (response.status === 200) {
          return response.json();
        } else {
          return { isError: true, error: response.json() };
        }
      },
      error => {
        return { isError: true, error: error };
      }
    );
  },

  logout() {
    return fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'same-origin'
    }).then(
      response => {
        if (response.status === 204) {
          return {};
        } else {
          return { isError: true, error: response.json() };
        }
      },
      error => {
        return { isError: true, error: error };
      }
    );
  },

  status() {
    return fetch('/api/auth/status', {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      credentials: 'same-origin'
    }).then(
      response => {
        if (response.status === 200) {
          return response.json();
        } else {
          return { isError: true, error: response.json() };
        }
      },
      error => {
        return { isError: true, data: error };
      }
    );
  },

  profile(profile) {
    if (profile) {
      // update
      return fetch('/api/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile),
        credentials: 'same-origin'
      }).then(
        response => {
          if (response.status === 201 || response.status === 204) {
            return {};
          } else {
            return { isError: true, error: response.json() };
          }
        },
        error => {
          return { isError: true, data: error };
        }
      );
    } else {
      // get
      return fetch('/api/auth/profile', {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        },
        credentials: 'same-origin'
      }).then(
        response => {
          if (response.status === 200) {
            return response.json();
          } else if (response.status === 204 || response.status === 404) {
            return {};
          } else {
            return { isError: true, error: response.json() };
          }
        },
        error => {
          return { isError: true, data: error };
        }
      );
    }
  }
};
