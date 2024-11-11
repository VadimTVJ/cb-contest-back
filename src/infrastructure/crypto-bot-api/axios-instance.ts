import axios from 'axios';

export const cbaAxiosInstance = axios.create({
  baseURL: 'https://testnet-pay.crypt.bot/api',
  headers: {
    'Content-Type': 'application/json',
    'Crypto-Pay-API-Token': process.env.CB_TOKEN as string,
  },
});

cbaAxiosInstance.interceptors.response.use(({ data }) => {
  return data.result;
});
