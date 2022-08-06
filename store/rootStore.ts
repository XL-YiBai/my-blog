// 该文件用于创建一个含有namespace的全局的根store，就是做一个整合的作用
import userStore, { IUserStore } from './userStore';

export interface IStore {
  user: IUserStore;
}

export default function createStore(initialValue: any): () => IStore {
  return () => {
    return {
      // 先把userStore展开，再把传入的初始化值展开覆盖相应字段
      user: { ...userStore(), ...initialValue?.user },
    };
  };
}
