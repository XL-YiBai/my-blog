import { useState } from 'react';
import Link from 'next/link';
import { Avatar, Button, Divider, Input, message } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store/index';
import Markdown from 'markdown-to-jsx';
import { format } from 'date-fns';
import { prepareConnection } from 'db/index';
import { Article } from 'db/entity';
import { IArticle } from 'pages/api';
import styles from './index.module.scss';
import request from 'service/fetch';

interface IProps {
  article: IArticle;
}

export async function getServerSideProps({ params }: any) {
  const articleId = params?.id; // 这里在参数ctx解构出params可以拿到动态路由的参数
  const db = await prepareConnection();
  const articleRepo = db.getRepository(Article);
  const article = await articleRepo.findOne({
    where: {
      id: articleId, // 查找条件是id等于动态路由的articleId
    },
    // 查询文章时，把外键关联的该文章用户信息、该文章评论、该评论的用户信息 一并返回
    relations: ['user', 'comments', 'comments.user'],
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
  const [inputVal, setInputVal] = useState(''); // 评论的输入框内容
  const [comments, setComments] = useState(article?.comments || []);

  // 点击发表评论的回调
  const handleComment = () => {
    request
      .post('/api/comment/publish', {
        articleId: article?.id,
        content: inputVal,
      })
      .then((res: any) => {
        if (res?.code === 0) {
          message.success('发表成功');

          // 因为使用SSR渲染，初始数据来源于服务端查询数据库，这里我们发表评论之后不能及时更新页面，
          // 所以我们把comment维护在一个useState里面，发表成功之后手动新的评论添加进去
          const newComments = [
            {
              id: Math.random(),
              creat_time: new Date(),
              update_time: new Date(),
              content: inputVal,
              user: {
                avatar: loginUserInfo?.avatar,
                nickname: loginUserInfo?.nickname,
              },
            },
          ].concat(comments);
          setComments(newComments);
          setInputVal('');
        } else {
          message.error('发表失败');
        }
      });
  };

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
      <div className={styles.divider}></div>
      <div className="content-layout">
        <div className={styles.comment}>
          <h3>评论</h3>
          {/* 登录状态下才展示发表评论的区域 */}
          {loginUserInfo?.userId && (
            <div className={styles.enter}>
              <Avatar src={avatar} size={40} />
              <div className={styles.content}>
                <Input.TextArea
                  placeholder="请输入评论..."
                  rows={4}
                  value={inputVal}
                  onChange={(event) => setInputVal(event?.target?.value)}
                />
                <Button type="primary" onClick={handleComment}>
                  发表评论
                </Button>
              </div>
            </div>
          )}
          <Divider />
          {/* 该文章的评论列表 */}
          <div className={styles.display}>
            {comments?.map((comment: any) => (
              <div className={styles.wrapper} key={comment.id}>
                <Avatar src={comment.user.avatar} size={40} />
                <div className={styles.info}>
                  <div className={styles.name}>
                    <div>{comment?.user?.nickname}</div>
                    <div className={styles.date}>
                      {format(
                        new Date(comment.update_time),
                        'yyyy-MM-dd hh:mm:ss'
                      )}
                    </div>
                  </div>
                  <div className={styles.content}>{comment?.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(ArticleDetail);
