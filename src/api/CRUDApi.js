import $http from "axios";
import * as qs from "query-string";

var api = "/api/all";

export default {
  name: "CRUDApi",
  create(user, pass, data, params) {
    user = "" + user;
    pass = "" + pass;
    params = params || {};

    return $http({
      method: "PUT",
      url: api,
      auth: {
        username: "" + user,
        password: "" + pass,
        sendImmediately: true
      },
      params: params,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: "repeat" });
      },
      data: data
    }).then(
      response => {
        return { isError: false, response: response };
      },
      error => {
        return { isError: true, error: error };
      }
    );
  },
  read(user, pass, params) {
    return $http({
      method: "GET",
      url: api,
      auth: {
        username: "" + user,
        password: "" + pass,
        sendImmediately: true
      },
      params: params
    }).then(
      response => {
        return { response: response.data || "" };
      },
      error => {
        return error;
      }
    );
  },
  update(user, pass, data, params) {
    user = "" + user;
    pass = "" + pass;
    params = params || {};

    return $http({
      method: "POST",
      url: api,
      auth: {
        username: "" + user,
        password: "" + pass,
        sendImmediately: true
      },
      params: params,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: "repeat" });
      },
      data: data
    }).then(
      response => {
        return { isError: false, response: response.data };
      },
      error => {
        return { isError: true, error: error };
      }
    );
  },
  delete(user, pass, uri, params) {
    user = "" + user;
    pass = "" + pass;
    params = params || {};

    return $http({
      method: "DELETE",
      url: api,
      auth: {
        username: "" + user,
        password: "" + pass,
        sendImmediately: true
      },
      params: {
        ...params,
        uri: uri
      }
    }).then(
      response => {
        return { response: response.data || "" };
      },
      error => {
        return error;
      }
    );
  }
};
