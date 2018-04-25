import $http from "axios";

export default {
  name: "DocumentApi",
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
        return { response: response.data || "" };
      },
      error => {
        return error;
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
  }
};
