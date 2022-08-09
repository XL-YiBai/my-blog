import Link from 'next/link';
import { Avatar } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store/index';
import Markdown from 'markdown-to-jsx';
import { format } from 'date-fns';
import { prepareConnection } from 'db/index';
import { Article } from 'db/entity';
import { IArticle } from 'pages/api';
import styles from './index.module.scss';

interface IProps {
  article: IArticle;
}

export async function getServerSideProps({ params }) {
  const articleId = params?.id;
  const db = await prepareConnection();
  const articleRepo = db.getRepository(Article);
  const article = await articleRepo.findOne({
    where: {
      id: articleId, // 查找条件是id等于动态路由的articleId
    },
    relations: ['user'], // 查询文章时，把外键关联的用户信息一并返回
  });

  if (article) {
    // 阅读次数 +1
    article.views = article?.views + 1;
    await articleRepo.save(article);
  }

  return {
    props: {
      article: JSON.parse(JSON.stringify(article)),
    },
  };
}

const ArticleDetail = (props: IProps) => {
  const { article } = props; // 这里就可以取到上面数据库查询出来的文章数据，用来做渲染
  const store = useStore();
  const loginUserInfo = store?.user?.userInfo; // 当前登录的用户信息
  const {
    user: { nickname, avatar, id },
  } = article;
  return (
    <div>
      <div className="content-layout">
        <h2 className={styles.title}>{article?.title}</h2>
        <div className={styles.user}>
          <Avatar src={avatar} size={50} />
          <div className={styles.info}>
            <div className={styles.name}>{nickname}</div>
            <div className={styles.date}>
              <div>
                {format(new Date(article.update_time), 'yyyy-MM-dd hh:mm:ss')}
              </div>
              <div>阅读 {article.views}</div>
              {/* 如果登录用户的id和文章作者的id一样，说明是本人的文章，展示编辑按钮 */}
              {Number(loginUserInfo?.userId) === Number(id) && (
                <Link href={`/editor/${article?.id}`}>编辑</Link>
              )}
            </div>
          </div>
        </div>
        <Markdown className={styles.markdown}>{article?.content}</Markdown>
      </div>
    </div>
  );
};

export default observer(ArticleDetail);
