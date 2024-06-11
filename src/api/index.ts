import {create} from 'apisauce';

const BASE_URL: string =
  'https://virtserver.swaggerhub.com/AbeerUlHaq/JohnCox/1.0.0/';

export const api = (baseURL: string) =>
  create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
