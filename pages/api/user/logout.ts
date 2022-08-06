// 注销（退出登录）的接口
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ISession } from 'pages/api/index';
import { ironOptions } from 'config/index';
import { Cookie } from 'next-cookie';
import { clearCookie } from 'utils';

// 通过withIronSessionApiRoute把路由函数logout包裹之后，就在req中存在session属性了
export default withIronSessionApiRoute(logout, ironOptions);

// 路由处理函数
async function logout(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const cookies = Cookie.fromApiRoute(req, res);

  // 清空session和cookies的信息
  await session.destroy();
  clearCookie(cookies);

  res.status(200).json({
    code: 0,
    msg: '退出成功',
    data: {},
  });
}
