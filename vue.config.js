const appHost = "localhost";
const appPort = "9031";
const appHttps = false;

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    devtool: "eval-source-maps"
  },
  devServer: {
    proxy: {
      "/api": {
        target: (appHttps ? "https" : "http") + "://" + appHost + ":" + appPort,
        secure: false,
        bypass: function(req) {
          if (req.url.startsWith("/api")) {
            console.log(
              "Proxying " +
                req.method +
                " " +
                req.url +
                " to " +
                (appHttps ? "https" : "http") +
                "://" +
                appHost +
                ":" +
                appPort
            );
          } else {
            return req.url;
          }
        }
      },
      // for legacy proxying support
      "/v1": {
        target: (appHttps ? "https" : "http") + "://" + appHost + ":" + appPort,
        secure: false,
        bypass: function(req) {
          if (req.url.startsWith("/v1")) {
            console.log(
              "Proxying " +
                req.method +
                " " +
                req.url +
                " to " +
                (appHttps ? "https" : "http") +
                "://" +
                appHost +
                ":" +
                appPort
            );
          } else {
            return req.url;
          }
        }
      }
    }
  }
};
