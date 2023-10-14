export enum Attribute {
  Bottom = 1,
  Tp = 2,
  Vers = 3,
  Others = 4, 
}
export enum Shape {
  猴 = 1,
  狒狒 = 2,
  熊 = 3,
  肌肉 = 4,
  匀称 = 5,
} 

export enum Hobbies {
  运动 = 1,
  创意艺术 = 2,
  音乐 = 3,
  旅游 = 4,
  阅读 = 5,
  写作 = 6,
  游戏 = 7,
  烹饪 = 8,
  健身 = 9,
}

export enum Career {
  '工业/制造业'=  1,
  '自由职业'= 2,
  '贸易/零售'= 3,
  '教育/科研'= 4,
  '专业服务'= 5,
  '房地产/建筑'= 6,
  '服务业'= 7,
  'IT/ 互联网/ 通信'= 8,
  '文化/艺术'= 9,
  '学生'= 10,
  '广告/营销'= 11,
  '影视/娱乐'= 12,
  '金融' = 13,
  '医药/ 健康/ 健身' =14
} 
export enum Favorite {
  年上 = 1,
  小鲜肉 = 2,
  肌肉 = 3,
  精瘦 = 4,
  熊熊 = 5,
  斯文 = 6,
  运动系 = 7,
  居家男 = 8,
}

function mapEnumToNameValueArray(enumType: any): { value: number; name: string }[] {
  return Object.keys(enumType)
    .filter(key => isNaN(Number(enumType[key])))
    .map(key => ({ value: Number(key) , name: enumType[key] }));
}

export const ATTRIBUTE_LIST = mapEnumToNameValueArray(Attribute);
export const SHAPE_LIST = mapEnumToNameValueArray(Shape);
export const HOBBY_LIST = mapEnumToNameValueArray(Hobbies);
export const CARRIER_LIST = mapEnumToNameValueArray(Career);
export const FAVORITE_LIST = mapEnumToNameValueArray(Favorite);