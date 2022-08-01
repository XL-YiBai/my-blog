import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from 'components/layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // 把路由通过子组件传递给Layout插入中间内容区域，这样路由改变时只有中间内容区域变化
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
