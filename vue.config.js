const mlHost = "localhost";
const mlPort = "9031";
const mlHttps = false;

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    devtool: "eval-source-maps"
  },
  devServer: {
    proxy: {
      "/api": {
        target: (mlHttps ? "https" : "http") + "://" + mlHost + ":" + mlPort,
        secure: false,
        bypass: function(req) {
          if (req.url.startsWith("/api")) {
            console.log(
              "Proxying " +
                req.method +
                " " +
                req.url +
                " to " +
                (mlHttps ? "https" : "http") +
                "://" +
                mlHost +
                ":" +
                mlPort
            );
          } else {
            return req.url;
          }
        }
      }
    }
  }
};
