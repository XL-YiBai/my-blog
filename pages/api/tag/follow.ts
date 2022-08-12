// 关注和取消关注的接口
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import { prepareConnection } from 'db/index';
import { Tag, User } from 'db/entity/index';
import { EXCEPTION_USER, EXCEPTION_TAG } from 'pages/api/config/codes';

// 通过withIronSessionApiRoute把路由函数包裹之后，就在req中存在session属性了
export default withIronSessionApiRoute(follow, ironOptions);

// 路由处理函数
async function follow(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { userId = 0 } = session;
  const { tagId, type } = req?.body || {};
  const db = await prepareConnection();
  const tagRepo = db.getRepository(Tag);
  const userRepo = db.getRepository(User);

  // 当前登录用户信息
  const user = await userRepo.findOne({
    where: {
      id: userId,
    },
  });

  // 当前要关注的那个标签信息
  const tag = await tagRepo.findOne({
    relations: ['users'], // 同时查询出关注此标签的用户
    where: {
      id: tagId,
    },
  });

  if (!user) {
    res.status(200).json({
      ...EXCEPTION_USER.NOT_LOGIN,
    });
    return;
  }

  if (tag?.users) {
    // 如果是要关注，就把这个标签关注的users数组添加当前登录的用户
    if (type === 'follow') {
      tag.users = tag.users.concat([user]);
      tag.follow_count = tag.follow_count + 1; // 关注数+1
    } else if (type === 'unfollow') {
      // 否则从这个标签关注的users中删除当前用户
      tag.users = tag.users.filter((user) => user.id !== userId);
      tag.follow_count = tag.follow_count - 1;
    }
  }

  if (tag) {
    const resTag = await tagRepo.save(tag);
    res.status(200).json({
      code: 0,
      msg: '',
      data: resTag,
    });
  } else {
    res.status(200).json({
      ...EXCEPTION_TAG.FOLLOW_FAILED,
    });
  }
}
