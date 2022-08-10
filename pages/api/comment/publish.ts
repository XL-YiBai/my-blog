// 发表评论的接口
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import { prepareConnection } from 'db/index';
import { User, Article, Comment } from 'db/entity/index';
import { EXCEPTION_COMMENT } from 'pages/api/config/codes';

// 通过withIronSessionApiRoute把路由函数包裹之后，就在req中存在session属性了
export default withIronSessionApiRoute(publish, ironOptions);

// 路由处理函数
async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { articleId = 0, content = '' } = req.body;
  const db = await prepareConnection();
  const commenRepo = db.getRepository(Comment);

  const comment = new Comment();

  comment.content = content;
  comment.create_time = new Date();
  comment.update_time = new Date();

  const user = await db.getRepository(User).findOne({
    id: session?.userId,
  });
  const article = await db.getRepository(Article).findOne({
    id: articleId,
  });

  if (user) {
    comment.user = user;
  }
  if (article) {
    comment.article = article;
  }

  const resComment = await commenRepo.save(comment);
  if (resComment) {
    res.status(200).json({
      code: 0,
      msg: '发表成功',
      data: resComment,
    });
  } else {
    res.status(200).json({
      ...EXCEPTION_COMMENT.PUBLISH_FAILED,
    });
  }
}
