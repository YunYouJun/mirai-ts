import axios, { AxiosStatic } from "axios";

function init(baseURL: string): AxiosStatic {
  axios.defaults.baseURL = baseURL;
  axios.defaults.timeout = 3000;
  return axios;
}

export default {
  init,
};
