import api from './request';

export const login = (params: {
  code: string;
}) => {
  return api.post('/pairs/login', params);
}