import api from './request';

interface IMatchItem {
  id: string,
  type: 1 | 2,
  title: string
}

export const activityList = () => {
  return api.post<{
    data: IMatchItem[]
  }>('/pairs/activityList');
}

export const answerQuestionActivity = (data: {
  activity_id: string,
  answer: string
}) => {
  return api.post('/pairs/activityAnswer', {
    data
  });
}