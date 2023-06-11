import api from './request';

export const login = (data: {
  code: string;
}) => {
  return api.post<{
    data: {
      is_new: boolean;
      token: string;
    }
  }>('/pairs/login', {data});
}

export interface ProfileData {
  avatar_ids: string[]
  nickname: string
  signature?: string
  attribute: number
  height?: number
  weight?: number
  hobby?: string
  carrier?: number
  shape?: number
  favorite?: string
}

export const editProfile = (data: ProfileData) => {
  return api.post('/pairs/profileEdit', { data });
}

export const getMyProfile = () => {
  return api.post<{
    data: ProfileData
  }>('/pairs/profileList');
}