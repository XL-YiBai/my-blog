import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns'; // 可以转化成距今多久
import { IArticle } from 'pages/api/index';
import { Avatar } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import styles from './index.module.scss';

interface IProps {
  article: IArticle;
}

const ListItem = (props: IProps) => {
  const { article } = props;
  const { user } = article;
  return (
    // eslint-disable-next-line @next/next/link-passhref
    <Link href={`/article/${article.id}`}>
      <div className={styles.container}>
        <div className={styles.article}>
          <div className={styles.userInfo}>
            <span className={styles.name}>{user?.nickname}</span>
            <span className={styles.date}>
              {formatDistanceToNow(new Date(article.update_time))}
            </span>
          </div>
          <h4 className={styles.title}>{article?.title}</h4>
          <p className={styles.content}>{article?.content}</p>
          <div className={styles.statics}>
            <EyeOutlined />
            <span>{article?.views}</span>
          </div>
        </div>
        <Avatar src={user.avatar} size={48} />
      </div>
    </Link>
  );
};

export default ListItem;
