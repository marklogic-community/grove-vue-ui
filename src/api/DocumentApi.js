import $http from "axios";

export default {
  name: "DocumentApi",
  create(user, pass, data, params) {
    user = "" + user;
    pass = "" + pass;
    params = params || {};

    return $http({
      method: "PUT", //TODO: change to POST once the muir-node accepts a request without a uri
      url: "/api/documents",
      auth: {
        username: "" + user,
        password: "" + pass,
        sendImmediately: true
      },
      params: params,
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
  update(user, pass, data, params) {
    user = "" + user;
    pass = "" + pass;
    params = params || {};

    return $http({
      method: "PUT",
      url: "/api/documents",
      auth: {
        username: "" + user,
        password: "" + pass,
        sendImmediately: true
      },
      params: params,
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
      url: "/api/documents",
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
  },
  get(user, pass, params) {
    return $http({
      method: "GET",
      url: "/api/documents",
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
  }
};
