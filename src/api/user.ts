import api from './request';

export const login = (data: {
  code: string;
}) => {
  return api.post<{
    data: {
      is_new: boolean;
      token: string;
      user_id: number;
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
  career?: number
  shape?: number
  favorite?: string
  shot: number
}

export const editProfile = (data: ProfileData) => {
  return api.post('/pairs/profileEdit', { data });
}

export const getUserProfile = (user_id: number) => {
  return api.post<{
    data: ProfileData
  }>('/pairs/profileList', { data: { user_id } });
}

export enum Action {
  CheckIn = 1,
  Ad = 2,
  Share = 3,
  Consume = 4
}

export const updateShot = (shot: number, action: Action) => {
  return api.post('/pairs/shotUpdate', { data: { shot, action } });
}