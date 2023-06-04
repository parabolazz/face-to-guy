import api from './request';

export const login = (data: {
  code: string;
}) => {
  return api.post('/pairs/login', {data});
}