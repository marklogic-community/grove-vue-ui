import Vue from "vue";
import Vuex from "vuex";

import authApi from "./api/AuthApi";
import searchApi from "./api/SearchApi";
import documentApi from "./api/DocumentApi";

Vue.use(Vuex);

const debug = true; //(process !== undefined) ? process.env.NODE_ENV !== "production" : true;

const auth = {
  namespaced: true,
  state: {
    loaded : false,
    authenticated: false,
    username: undefined,
    password: undefined,
    profile: undefined
  },
  mutations: {
    loggedIn(state, { username, password }) {
      state.authenticated = true;
      state.username = username;
      state.password = password;
    },
    loggedOut(state) {
      state.authenticated = false;
      state.username = undefined;
      state.password = undefined;
      state.profile = undefined;
    },
    gotStatus(state, { authenticated }) {
      state.loaded = true;
      state.authenticated = authenticated;
      if (!authenticated) {
        state.username = undefined;
        state.password = undefined;
        state.profile = undefined;
      }
    },
    gotProfile(state, { profile }) {
      state.profile = profile || {};
    },
    updatedProfile(state, { profile }) {
      state.profile = profile || {};
    }
  },
  actions: {
    getStatus({ commit }) {
      return authApi.status().then(result => {
        if (result.isError) {
          // error
          return result;
        } else {
          commit("gotStatus", {
            authenticated: result.authenticated
          });
          if (result.authenticated) {
            commit("loggedIn", {
              username: result.username,
              password: undefined
            });
            authApi.profile().then(result => {
              if (result.isError) {
                // error
                return result;
              } else {
                commit("gotProfile", {
                  profile: result
                });
              }
            });
          }
        }
      });
    },
    login({ commit }, { user, pass }) {
      return authApi.login(user, pass).then(result => {
        if (result.isError) {
          // error
          return result;
        } else {
          commit("loggedIn", {
            username: user,
            password: pass
          });
          authApi.profile().then(result => {
            if (result.isError) {
              // error
              return result;
            } else {
              commit("gotProfile", {
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
          dispatch("loggedOut", null, { root: true });
        }
      });
    },
    update({ dispatch }, payload) {
      return authApi.profile(payload).then(result => {
          if (result.isError) {
            // error
            return result;
          } else {
              dispatch("getStatus");
          }
      });
    }
  }
};

const search = {
  namespaced: true,
  state: { all: {} },
  mutations: {
    updateSearch(state, payload) {
      const mode = payload.mode || "all";
      state[mode] = {
        qtext: getSearchParam(payload, state, "qtext"),
        page: getSearchParam(payload, state, "page"),
        pageLength: getSearchParam(payload, state, "pageLength"),
        activeFacets: getSearchParam(payload, state, "activeFacets"),
        response: getSearchParam(payload, state, "response")
      };
    },
    toggleFacet(state, payload) {
      const mode = payload.mode || "all";
      const activeFacet = getSearchParam(payload, state, "activeFacets")[
        payload.facetName
      ];
      if (activeFacet) {
        const activeValue = activeFacet.values.filter(value => {
          return value.value === payload.value;
        });
        if (activeValue.length) {
          activeFacet.values = activeFacet.values.filter(value => {
            return value.value !== payload.value;
          });
        } else {
          activeFacet.values.push({
            value: payload.value,
            negate: payload.negate
          });
        }
      } else {
        state[mode].activeFacets[payload.facetName] = {
          values: [{ value: payload.value, negate: payload.negate }]
        };
      }
    }
  },
  actions: {
    search({ commit, rootState }, payload) {
      return searchApi
        .search(
          rootState.auth.username,
          rootState.auth.password,
          payload.mode,
          payload.qtext,
          payload.page,
          payload.length
        )
        .then(result => {
          if (result.response) {
            commit("updateSearch", result);
          } else {
            // error
            return result;
          }
        });
    },
    toggleFacet({ commit, dispatch }, payload) {
      commit("toggleFacet", payload);
      return dispatch({});
    }
  }
};

const document = {
  namespaced: true,
  actions: {
    create({rootState}, payload) {
      return documentApi
        .create(
          rootState.auth.username,
          rootState.auth.password,
          payload.data,
          payload.params
        )
        .then(result => {
            return result;
        });
    },
    update({rootState}, payload) {
      return documentApi
        .update(
          rootState.auth.username,
          rootState.auth.password,
          payload.data,
          payload.params
        )
        .then(result => {
            return result;
        });
      },
    get({rootState}, payload) {
      return documentApi
        .get(
          rootState.auth.username,
          rootState.auth.password,
          payload
        )
        .then(result => {
          return result;
        });
    }
  }
};

function getSearchParam(payload, state, param) {
  const mode = payload.mode || "all";
  return payload[param] || (state[mode] && state[mode][param]);
}

export default new Vuex.Store({
  strict: debug,
  state: {},
  mutations: {},
  actions: {
    loggedOut({ commit }) {
      commit("auth/loggedOut");
    }
  },
  modules: {
    auth,
    search,
    document
  }
});
