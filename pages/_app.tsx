import '../styles/globals.css';
import { StoreProvider } from 'store/index';
import Layout from 'components/layout';
import { NextPage } from 'next';

interface IProps {
  initialValue: Record<any, any>
  Component: NextPage
  pageProps: any
}

function MyApp({ initialValue, Component, pageProps }: IProps) {
  return (
    // 使用Provider让所有子组件都拿到mobx中的store
    // 把initialValue传入组件，在StoreProvider组件中用initialValue初始化store
    <StoreProvider initialValue={initialValue}>
      {/* 把路由通过子组件传递给Layout插入中间内容区域，这样路由改变时只有中间内容区域变化 */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StoreProvider>
  );
}

// 在MyApp.getInitialProps接受一个对象包含ctx上下文，并返回一个对象，对象的属性会依次注入到MyApp组件的props中
MyApp.getInitialProps = async ({ ctx }: { ctx: any }) => {
  // 在ctx.req中可以拿到客户端请求携带过来的cookie
  const { userId, nickname, avatar } = ctx?.req?.cookies || {};
  return {
    initialValue: {
      user: {
        userInfo: {
          userId,
          nickname,
          avatar,
        }
      }
    },
  };
};

export default MyApp;
