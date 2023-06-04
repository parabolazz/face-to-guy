import api from './request';

export const login = (data: {
  code: string;
}) => {
  return api.post<{
    data: string
  }>('/pairs/login', {data});
}