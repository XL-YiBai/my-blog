import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { StoreProvider } from 'store/index';
import Layout from 'components/layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // 使用Provider让所有子组件都拿到mobx中的store
    <StoreProvider initialValue={{ user: {} }}>
      {/* 把路由通过子组件传递给Layout插入中间内容区域，这样路由改变时只有中间内容区域变化 */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StoreProvider>
  );
}

export default MyApp;
