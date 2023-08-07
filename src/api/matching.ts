import api from './request';

export interface IQuestion {
  id: number,
  type: 1 | 2,
  title: string
}

export interface IAnswer {
  answer: string
  attribute: number
  avatar_id: string
  height: number
  id: number
  nickname: string
  shape: number
  title: string
  type: 1 | 2
  weight: number
  user_id: number
}

export interface IMatchItem extends IQuestion, IAnswer {}

export const getActivityList = (data: {
  a_id: number,
  user_id: number,
  groups: string
}) => {
  return api.post<{
    data: {
      ad: IMatchItem[] | null
      answer: IMatchItem[] | null
      question: IMatchItem[] | null
      group: number
    }
  }>('/pairs/activityList', { data });
}

export const answerQuestionActivity = (data: {
  activity_id: number,
  answer: string
  user_id: number
}) => {
  return api.post('/pairs/activityAnswer', {
    data
  });
}

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