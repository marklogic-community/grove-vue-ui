import $http from "axios";

export default {
  name: "LoginApi",
  login(user, pass) {
    var params = new URLSearchParams();
    params.append("username", "" + user);
    params.append("password", "" + pass);
    return fetch("/api/user/login", {
      method: "POST",
      body: JSON.stringify({
        username: "" + user,
        password: "" + pass
      }),
      credentials: "same-origin"
    }).then(
      response => {
        return { profile: response.data || {} };
      },
      error => {
        return error;
      }
    );
  }
};
