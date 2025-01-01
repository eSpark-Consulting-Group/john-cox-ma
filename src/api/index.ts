import {create} from 'apisauce';


export const api = (baseURL: string) =>
  create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
