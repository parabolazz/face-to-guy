import api from './request';


export const leaveMessage = (data: {
  user_id: number,
  follow_user_id: number,
  wechat: string,
  message: string
}) => {
  return api.post('/pairs/leaveMessage', {
    data
  })
}

export interface IChatMeUp {
  user_id: number,
  nickname: string,
  avatar_id: string
  wechat: string,
  message: string,
  is_read: 0 | 1,
}

export const getChatMeUpList = (data: {
  user_id: number,
  follow: 0
}) => {
  return api.post<{data: IChatMeUp[]}>('/pairs/chatUpList', {
    data
  });
}

export interface IMyChatUp {
  attribute: number,
  avatar_id: string,
  height: number,
  nickname: string,
  shape: number,
  user_id: number,
  weight:  number,
}

export const getMyChatUpList = (data: {
  user_id: number,
  follow: 1, // 0 代表被搭讪列表，1 代表搭讪列表
  }) => {
  return api.post<{data: IMyChatUp[]}>('/pairs/chatUpList', {
    data
  });
}

export const getUnreadMessageLength = (data: { user_id: number }) => {
  return api.post<{data: number}>('/pairs/redPoint', {
    data
  });
}

export const updateMessageRead = (data: { user_id: number, follow_user_id: number }) => {
  return api.post('/pairs/isRead', {
    data
  });
}