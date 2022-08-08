import { IronSession } from 'iron-session';
import { IUserInfo } from 'store/userStore';

export type IArticle = {
  id: number
  title: string
  content: string
  views: number
  create_time: Date
  update_time: Date
  user: IUserInfo
}

// 定义自己的ISession类型有原来的IronSession，并支持任意一种key-value形式
export type ISession = IronSession & Record<string, any>;
