import $http from "axios";

export default {
  name: "DocumentApi",
  create(user, pass, content, params) {
    user = "" + user;
    pass = "" + pass;
    params = params || {};

    return $http({
      method: "POST",
      url: "/api/documents",
      auth: {
        username: "" + user,
        password: "" + pass,
        sendImmediately: true
      },
      params: params,
      data: content
    }).then(
      response => {
        return { isError: false, response: response };
      },
      error => {
        return { isError: true, error: error };
      }
    );
  },
  update(user, pass, uri, content, params) {
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
      params: {
        ...params,
        uri: uri
      },
      data: content
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
