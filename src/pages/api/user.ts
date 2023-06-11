import api from './request';

export const login = (data: {
  code: string;
}) => {
  return api.post<{
    data: string
  }>('/pairs/login', {data});
}

interface ProfileRequestData {
  avatar_ids: string[]
  nickname: string
  signature?: string
  attribute: number
  height?: number
  weight?: number
  hobby?: string
  carrier?: string
  shape?: number
  favorite?: string
}

export const editProfile = (data: ProfileRequestData) => {
  return api.post('/pairs/profile', { data });
}