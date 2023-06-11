import api from './request';

export const login = (data: {
  code: string;
}) => {
  return api.post<{
    data: {
      isNew: boolean;
      token: string;
    }
  }>('/pairs/login', {data});
}

interface ProfileData {
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

export const editProfile = (data: ProfileData) => {
  return api.post('/pairs/profile', { data });
}

export const getMyProfile = () => {
  return api.get<{
    data: ProfileData
  }>('/pairs/profileList');
}