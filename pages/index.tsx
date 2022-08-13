import { useState, useEffect } from 'react';
import { Divider } from 'antd';
import classnames from 'classnames';
import { prepareConnection } from 'db/index';
import { Article, Tag } from 'db/entity';
import ListItem from 'components/ListItem';
import { IArticle } from 'pages/api/index';
import request from 'service/fetch';
import styles from './index.module.scss';

interface ITag {
  id: number;
  title: string;
}

interface IProps {
  articles: IArticle[];
  tags: ITag[];
}

/**
 * 这里暴露出的getServerSideProps函数返回对象中的props，将传递给下面的Home组件中的props用作SSR渲染的数据
 * 这个props在网页查看源代码的时候会展现出来，因此不能传入敏感数据。props中的字段需要转JSON，否则报错。
 */
export async function getServerSideProps() {
  const db = await prepareConnection();
  const articles = await db.getRepository(Article).find({
    relations: ['user', 'tags'], // 查询文章时，把外键关联的用户信息、标签一并返回
  });
  const tags = await db.getRepository(Tag).find({
    relations: ['users'],
  });

  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) || [],
      tags: JSON.parse(JSON.stringify(tags)) || [],
    },
  };
}

const Home = (props: IProps) => {
  const { articles, tags } = props;
  const [selectTag, setSelectTag] = useState(0); // 标识当前选中的标签
  const [showArticles, setShowArticles] = useState([...articles]); // 需要渲染的文章列表，默认为全部文章

  // 选择标签的回调
  const handleSelectTag = (event: any) => {
    const { tagid } = event?.target?.dataset || {};
    if (tagid) {
      setSelectTag(Number(tagid));
    }
  };

  useEffect(() => {
    // 根据当前选中标签，筛选出文章列表
    selectTag &&
      request.get(`/api/article/get?tag_id=${selectTag}`).then((res: any) => {
        if (res?.code === 0) {
          setShowArticles(res?.data);
        }
      });
  }, [selectTag]);

  return (
    <div>
      <div className={styles.tags} onClick={handleSelectTag}>
        {tags?.map((tag) => (
          <div
            key={tag?.id}
            data-tagid={tag?.id} // 绑定一个自定义属性，用于实践冒泡拿到当前tag的id
            className={classnames(
              styles.tag,
              selectTag === tag?.id ? styles['active'] : ''
            )}
          >
            {tag?.title}
          </div>
        ))}
      </div>
      <div className="content-layout">
        {showArticles?.map((article) => (
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
