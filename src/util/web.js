import axios from "axios";

const corsServerUrl = "http://localhost:8080/";

export function getUrlData(url) {
  // let origin = window.location.protocol + "//" + window.location.host;
  axios({
    method: "GET",
    url: corsServerUrl + url,
    // headers: {
    //   Origin: origin,
    // },
  });
}
