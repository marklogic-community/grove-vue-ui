import Vue from "vue";
import Vuex from "vuex";

import loginApi from "./api/LoginApi";
import searchApi from "./api/SearchApi";

Vue.use(Vuex);

const debug = true; //(process !== undefined) ? process.env.NODE_ENV !== "production" : true;

function initAuthState(state) {
  state.isLoggedIn = false;
  state.username = undefined;
  state.password = undefined;
  state.profile = undefined;
}

const auth = {
  namespaced: true,
  state: initAuthState({}),
  mutations: {
    flushState(state) {
      initAuthState(state);
    },
    updateAuth(state, payload) {
      state.isLoggedIn = !!payload.user;
      state.username = payload.user;
      state.password = payload.pass;
      state.profile = payload.profile || {};
    }
  },
  actions: {
    login({ commit }, payload) {
      const user = payload.user;
      const pass = payload.pass;
      return loginApi.login(user, pass).then(result => {
        if (result.profile) {
          commit("updateAuth", {
            user: user,
            pass: pass,
            profile: result.profile
          });
        } else {
          // error
          return result;
        }
      });
    },
    cancelLogin() {
      return new Promise(resolve => {
        resolve();
      });
    },
    logout({ dispatch }) {
      return new Promise(resolve => {
        dispatch("flushState", null, { root: true });
        resolve();
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

function getSearchParam(payload, state, param) {
  const mode = payload.mode || "all";
  return payload[param] || (state[mode] && state[mode][param]);
}

export default new Vuex.Store({
  strict: debug,
  state: {},
  mutations: {},
  actions: {
    flushState({ commit }) {
      commit("auth/flushState");
    }
  },
  modules: {
    auth,
    search
  }
});
