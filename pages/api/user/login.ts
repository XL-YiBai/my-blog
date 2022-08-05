import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { prepareConnection } from 'db/index';
import { User } from 'db/entity/index';

// 通过withIronSessionApiRoute把路由函数包裹之后，就在req中存在session属性了
export default withIronSessionApiRoute(login, ironOptions);

// 路由处理函数
async function login(req: NextApiRequest, res: NextApiResponse) {
  const { phone = '', verify = '' } = req.body;

  const db = await prepareConnection();
  const userRepo = db.getRepository(User);
  const users = await userRepo.find();

  console.log(phone, verify);
  console.log(users);

  res.status(200).json({ phone, verify, code: 0 });
}
