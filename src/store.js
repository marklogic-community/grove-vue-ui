import Vue from 'vue';
import Vuex from 'vuex';

import authApi from './api/AuthApi';
import searchApi from './api/SearchApi';
import crudApi from './api/CRUDApi';

Vue.use(Vuex);

const debug = true; //(process !== undefined) ? process.env.NODE_ENV !== "production" : true;

const auth = {
  namespaced: true,
  state: {
    initialized: false,
    authenticated: false,
    username: undefined,
    profile: undefined
  },
  mutations: {
    isInitialized(state, { initialized }) {
      state.initialized = initialized;
    },
    isAuthenticated(state, { authenticated }) {
      state.authenticated = authenticated;
      if (!authenticated) {
        state.username = undefined;
        state.profile = undefined;
      }
    },
    loggedIn(state, { username }) {
      state.authenticated = true;
      state.username = username;
    },
    loggedOut(state) {
      state.authenticated = false;
      state.username = undefined;
      state.profile = undefined;
    },
    setProfile(state, { profile }) {
      state.profile = profile || {};
    }
  },
  actions: {
    init({ commit, dispatch }) {
      return authApi.status().then(result => {
        if (result.isError) {
          // error
          return result;
        } else {
          commit('isInitialized', { initialized: true });
          commit('isAuthenticated', {
            authenticated: result.authenticated
          });
          if (result.authenticated) {
            dispatch(
              'loggedIn',
              {
                username: result.username
              },
              { root: true }
            );
            authApi.profile().then(result => {
              if (result.isError) {
                // error
                return result;
              } else {
                commit('setProfile', {
                  profile: result
                });
              }
            });
          }
        }
      });
    },
    login({ commit, dispatch }, { user, pass }) {
      return authApi.login(user, pass).then(result => {
        if (result.isError) {
          // error
          return result;
        } else {
          dispatch(
            'loggedIn',
            {
              username: user
            },
            { root: true }
          );
          authApi.profile().then(result => {
            if (result.isError) {
              // error
              return result;
            } else {
              commit('setProfile', {
                profile: result
              });
            }
          });
        }
      });
    },
    cancelLogin() {
      return new Promise(resolve => {
        resolve();
      });
    },
    logout({ dispatch }) {
      return authApi.logout().then(result => {
        if (result.isError) {
          // error
          return result;
        } else {
          dispatch('loggedOut', null, { root: true });
        }
      });
    },
    initProfile({ dispatch }, payload) {
      return authApi.profile(payload).then(result => {
        if (result.isError) {
          // error
          return result;
        } else {
          dispatch('getStatus');
        }
      });
    }
  }
};

function typedSearchState(searchType) {
  return {
    namespaced: true,
    state: {
      initialized: false,
      start: 1,
      pageLength: 10,
      total: 0,
      facets: {},
      results: undefined,
      qtext: '',
      activeFacets: {}
    },
    mutations: {
      isInitialized(state, { initialized }) {
        state.initialized = initialized;
      },
      setResults(state, { response }) {
        if (response.results) {
          state.total = response.total;
          state.results = response.results;
        }
      },
      setFacets(state, { response }) {
        if (response.facets) {
          state.facets = response.facets;
        }
      },
      setText(state, { qtext }) {
        if (qtext !== undefined) {
          state.qtext = qtext;
        }
      },
      setPage(state, { page }) {
        state.start = (page - 1) * state.pageLength + 1;
      },
      toggleActiveFacet(state, { facet, type, value, negated }) {
        const activeFacet = state.activeFacets[facet];
        if (activeFacet) {
          const activeValue = activeFacet.values.filter(facetValue => {
            return facetValue.value === value;
          });
          if (activeValue.length) {
            activeFacet.values = activeFacet.values.filter(facetValue => {
              return facetValue.value !== value;
            });
          } else {
            activeFacet.values.push({
              value: value,
              negated: negated
            });
          }
        } else {
          state.activeFacets[facet] = {
            type: type,
            values: [{ value: value, negated: negated }]
          };
        }
        // FIXME? clone activeFacets to 'force' ui updates
        state.activeFacets = {
          ...state.activeFacets
        };
      }
    },
    actions: {
      init({ commit, state }) {
        commit('isInitialized', { initialized: true });
        searchApi
          .getFacets(searchType, state.qtext, state.activeFacets)
          .then(result => {
            if (result.response) {
              commit('setFacets', result);
            } else {
              // error
              return result;
            }
          });
        return searchApi
          .getResults(
            searchType,
            state.qtext,
            state.activeFacets,
            state.start,
            state.pageLength
          )
          .then(result => {
            if (result.response) {
              commit('setResults', result);
            } else {
              // error
              return result;
            }
          });
      },
      search({ commit, state }, { qtext }) {
        commit('setText', { qtext });
        searchApi
          .getFacets(searchType, state.qtext, state.activeFacets)
          .then(result => {
            if (result.response) {
              commit('setFacets', result);
            } else {
              // error
              return result;
            }
          });
        return searchApi
          .getResults(
            searchType,
            state.qtext,
            state.activeFacets,
            state.start,
            state.pageLength
          )
          .then(result => {
            if (result.response) {
              commit('setResults', result);
            } else {
              // error
              return result;
            }
          });
      },
      paginate({ commit, state }, { page }) {
        commit('setPage', { page });
        return searchApi
          .getResults(
            searchType,
            state.qtext,
            state.activeFacets,
            state.start,
            state.pageLength
          )
          .then(result => {
            if (result.response) {
              commit('setResults', result);
            } else {
              // error
              return result;
            }
          });
      },
      toggleFacet({ commit, state }, { facet, type, value, negated }) {
        commit('toggleActiveFacet', { facet, type, value, negated });
        searchApi
          .getFacets(searchType, state.qtext, state.activeFacets)
          .then(result => {
            if (result.response) {
              commit('setFacets', result);
            } else {
              // error
              return result;
            }
          });
        return searchApi
          .getResults(
            searchType,
            state.qtext,
            state.activeFacets,
            state.start,
            state.pageLength
          )
          .then(result => {
            if (result.response) {
              commit('setResults', result);
            } else {
              // error
              return result;
            }
          });
      }
    },
    getters: {
      page(state) {
        return Math.ceil(state.start / state.pageLength);
      }
    }
  };
}

const types = ['all'];

var searchModules = {};
types.forEach(function(type) {
  searchModules[type] = typedSearchState(type);
});

const search = {
  namespaced: true,
  state: {
    initialized: false
  },
  modules: searchModules,
  mutations: {
    isInitialized(state, { initialized }) {
      state.initialized = initialized;
    }
  },
  actions: {
    init({ commit, dispatch }) {
      types.forEach(function(type) {
        dispatch(type + '/init');
      });
      commit('isInitialized', { initialized: true });
    }
  }
};

function typedCrudState(crudType) {
  return {
    namespaced: true,
    state: {
      initialized: false
    },
    mutations: {
      isInitialized(state, { initialized }) {
        state.initialized = initialized;
      }
    },
    actions: {
      init({ commit }) {
        commit('isInitialized', { initialized: true });
      },
      view(context, { id, view }) {
        return crudApi.view(crudType, id, view);
      },
      create(context, { id, data, format }) {
        return crudApi.create(crudType, id, data, format);
      },
      read(context, { id }) {
        return crudApi.read(crudType, id);
      },
      update(context, { id, data, format }) {
        return crudApi.update(crudType, id, data, format);
      },
      delete(context, { id }) {
        return crudApi.delete(crudType, id);
      }
    }
  };
}

var crudModules = {};
types.forEach(function(type) {
  crudModules[type] = typedCrudState(type);
});

const crud = {
  namespaced: true,
  state: {
    initialized: false
  },
  modules: crudModules,
  mutations: {
    isInitialized(state, { initialized }) {
      state.initialized = initialized;
    }
  },
  actions: {
    init({ commit, dispatch }) {
      types.forEach(function(type) {
        dispatch(type + '/init');
      });
      commit('isInitialized', { initialized: true });
    }
  }
};

export default new Vuex.Store({
  strict: debug,
  state: {
    initialized: false
  },
  mutations: {
    isInitialized(state, { initialized }) {
      state.initialized = initialized;
    }
  },
  actions: {
    init({ commit, dispatch }) {
      return dispatch('auth/init').then(function() {
        commit('isInitialized', { initialized: true });
      });
    },
    loggedIn({ commit, dispatch }, payload) {
      commit('auth/loggedIn', payload);
      dispatch('search/init');
      dispatch('crud/init');
    },
    loggedOut({ commit }, payload) {
      commit('auth/loggedOut', payload);
    }
  },
  modules: {
    auth,
    search,
    crud
  }
});
