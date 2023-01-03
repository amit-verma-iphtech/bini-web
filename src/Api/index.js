import AXIOS from 'axios';
import endpoints from './endpoints';

const getToken = () => JSON.parse(localStorage.getItem('jwt'))?.token;
const AxiosCancelToken = AXIOS.CancelToken;

const axios = AXIOS.create({ baseURL: `${endpoints.baseUri}/v1` });

const dataFetcher = ({ url, method, data, cancelToken, num }) => axios({
  url,
  method,
  ...data && { data },
  headers: {
    Authorization: getToken() ? `Bearer ${getToken()}` : '',
  },
  ...cancelToken && { cancelToken },
}).then((res) => ({ ...res.data, code: res.status }))
  .catch(({ response }) => response.data);

export {
  axios,
  AxiosCancelToken,
  dataFetcher,
  endpoints,
  getToken,
};
