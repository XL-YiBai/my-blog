import '../styles/globals.css';
import { StoreProvider } from 'store/index';
import ErrorBoundary from 'components/ErrorBundary';
import Layout from 'components/layout';
import { NextPage } from 'next';

interface IProps {
  initialValue: Record<any, any>
  Component: NextPage
  pageProps: any
}

function MyApp({ initialValue, Component, pageProps }: IProps) {
  // 根据要渲染的路由组件Component上的layout属性是否为null，来动态决定要不要展示Layout(也就是页头页脚)
  const renderLayout = () => {
    if ((Component as any).layout === null) {
      return <Component {...pageProps} />
    } else {
      return (
        // 把路由通过子组件传递给Layout插入中间内容区域，这样路由改变时只有中间内容区域变化
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )
    }
  }

  return (
    // 使用Provider让所有子组件都拿到mobx中的store
    // 把initialValue传入组件，在StoreProvider组件中用initialValue初始化store
    <ErrorBoundary>
      <StoreProvider initialValue={initialValue}>
        {renderLayout()}
      </StoreProvider>
    </ErrorBoundary>
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
