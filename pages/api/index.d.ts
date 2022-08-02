import { IronSession } from 'iron-session';

// 定义自己的ISession类型有原来的IronSession，并支持任意一种key-value形式
export type ISession = IronSession & Record<string, any>;
