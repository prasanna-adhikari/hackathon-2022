import Axios from 'axios';
import BASE_URL from './baseUrl';
import { useEffect } from 'react';
let token;

// const token = cookie.get("travel-auth-token");
token = localStorage.getItem('travel-auth-token');
export const publicFetch = Axios.create({ baseURL: BASE_URL });
export const privateFetchFormData = Axios.create({
  baseURL: BASE_URL,
  headers: {
    authorization: 'Bearer ' + token,
    'Content-Type': 'multipart/form-data',
  },
});
export const privateFetch = Axios.create({
  baseURL: BASE_URL,
  headers: {
    authorization: 'Bearer ' + token,
  },
});
