import { Divider } from 'antd';
import { prepareConnection } from 'db/index';
import { Article } from 'db/entity';
import ListItem from 'components/ListItem';
import { IArticle } from 'pages/api/index';

interface IProps {
  articles: IArticle[];
}

/**
 * 这里暴露出的getServerSideProps函数返回对象中的props，将传递给下面的Home组件中的props用作SSR渲染的数据
 * 这个props在网页查看源代码的时候会展现出来，因此不能传入敏感数据。props中的字段需要转JSON，否则报错。
 */
export async function getServerSideProps() {
  const db = await prepareConnection();
  const articles = await db.getRepository(Article).find({
    relations: ['user'], // 查询文章时，把外键关联的用户信息一并返回
  });

  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) || [],
    },
  };
}

const Home = (props: IProps) => {
  const { articles } = props;

  return (
    <div>
      <div className="content-layout">
        {articles?.map((article) => (
          <>
            <ListItem article={article} />
            <Divider />
          </>
        ))}
      </div>
    </div>
  );
};

export default Home;
