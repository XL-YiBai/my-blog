import React, { createContext, ReactElement, useContext } from 'react';
import { useLocalObservable, enableStaticRendering } from 'mobx-react-lite';
import createStore, { IStore } from './rootStore';

interface IProps {
  initialValue: Record<any, any>;
  children: ReactElement;
}

// 如果是node环境(SSR)就把这个设为true，如果是浏览器环境就设为false
enableStaticRendering(!process.browser); 

const StoreContext = createContext({});

// 导出一个Provider组件，在_app.tsx中包裹入口组件，用于将store传递给包裹的子组件
export const StoreProvider = ({ initialValue, children }: IProps) => {
  // 生成一个被mobx观察的对象
  const store: IStore = useLocalObservable(createStore(initialValue));
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

// 导出一个useStore的hook，用于方便拿到store
export const useStore = () => {
  const store:IStore = useContext(StoreContext) as IStore
  if (!store) {
    throw new Error('数据不存在')
  }
  return store
};
