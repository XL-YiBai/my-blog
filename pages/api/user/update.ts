// 登录的接口
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import { prepareConnection } from 'db/index';
import { User } from 'db/entity/index';
import { EXCEPTION_USER } from 'pages/api/config/codes';

// 通过withIronSessionApiRoute把路由函数包裹之后，就在req中存在session属性了
export default withIronSessionApiRoute(update, ironOptions);

// 路由处理函数
async function update(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { userId } = session;
  const { nickname = '', job = '暂无', introduce = '暂无' } = req.body;
  const db = await prepareConnection(); // 连接数据库
  const userRepo = db.getRepository(User);

  const user = await userRepo.findOne({
    where: {
      id: Number(userId),
    },
  });

  if (user) {
    user.nickname = nickname;
    user.job = job;
    user.introduce = introduce;

    const resUser = userRepo.save(user);

    res?.status(200)?.json({
      code: 0,
      msg: '',
      data: resUser,
    });
  } else {
    res?.status(200)?.json({
      ...EXCEPTION_USER.NOT_FOUND,
    });
  }
}
