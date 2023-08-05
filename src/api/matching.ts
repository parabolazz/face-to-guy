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
}) => {
  return api.post('/pairs/activityAnswer', {
    data
  });
}