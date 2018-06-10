import $http from "axios";

export default {
  name: "SearchApi",
  search(user, pass, mode, qtext, page, pageLength, activeFacets) {
    user = "" + user;
    pass = "" + pass;
    mode = mode !== undefined ? mode : "all";
    qtext = qtext !== undefined ? qtext : "";
    page = page || 1;
    pageLength = pageLength || 10;

    for (var facetName in activeFacets) {
      if (activeFacets.hasOwnProperty(facetName)) {
        var facetValue = activeFacets[facetName];
        qtext +=
          (facetValue.negate ? " -" : " ") + facetName + ":" + facetValue.value;
      }
    }

    return $http({
      method: "GET",
      url: "/v1/search",
      auth: {
        username: "" + user,
        password: "" + pass,
        sendImmediately: true
      },
      params: {
        q: qtext,
        start: (page - 1) * pageLength + 1,
        pageLength: pageLength,
        options: mode
      }
    }).then(
      response => {
        response.data.results.forEach(function(result) {
          if (! result.id) {
            result.id = encodeURIComponent(result.uri);
          }
        });
        return { response: response.data };
      },
      error => {
        return error;
      }
    );
  }
};
