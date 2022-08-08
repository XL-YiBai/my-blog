import { Divider } from 'antd';
import { prepareConnection } from 'db/index';
import { Article } from 'db/entity';
import ListItem from 'components/ListItem';
import { IArticle } from 'pages/api/index';

interface IProps {
  articles: IArticle[];
}

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
