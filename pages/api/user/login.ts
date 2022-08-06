// 登录的接口
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import { setCookie } from 'utils/index';
import { prepareConnection } from 'db/index';
import { User, UserAuth } from 'db/entity/index';

// 引入之前db/index导出的连接函数，调用即可获取数据库对象db，在db上可以调用db.getRepository(映射对象)，
// 就可以连接到数据库，通过对象的形式操作数据库，，每一个操作方法都会对应一个sql语句，返回查询的Promise。比如find就是查出所有数据，如下。

// 通过withIronSessionApiRoute把路由函数包裹之后，就在req中存在session属性了
export default withIronSessionApiRoute(login, ironOptions);

// 路由处理函数
async function login(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const cookies = Cookie.fromApiRoute(req, res); // 拿到cookie操作对象
  const { phone = '', verify = '', identity_type = 'phone' } = req.body;
  const db = await prepareConnection(); // 连接数据库
  const userAuthRepo = db.getRepository(UserAuth); // 获取和user_auths表的映射对象

  // 如果用户输入的验证码和session中存取的验证码一致
  if (String(session.verifyCode) === String(verify)) {
    // 在user_auths表中查找 identity_type 这种登录方式是否有记录
    const userAuth = await userAuthRepo.findOne(
      {
        // 第一个参数对象是查找条件，登录验证类型是用户选择的类型 以及 登录标识是用户的手机号
        identity_type,
        identifier: phone,
      },
      {
        relations: ['user'], // 从user表关系型查找，顺带会把user_id对应的那个数据一并返回
      }
    );

    if (userAuth) {
      // 已存在的用户
      const user = userAuth.user;
      const { id, nickname, avatar } = user;

      // 把用户信息存在session中，实现登录状态
      session.userId = id;
      session.nickname = nickname;
      session.avatar = avatar;
      await session.save();
      // 设置cookie，用于登录持久化
      setCookie(cookies, { id, nickname, avatar });

      res.status(200).json({
        code: 0,
        msg: '登录成功',
        data: {
          userId: id,
          nickname,
          avatar,
        },
      });
    } else {
      // 新用户，自动注册
      const user = new User();
      user.nickname = `用户_${Math.floor(Math.random() * 10000)}`; // 随机生成一个用户名
      user.avatar = '/images/avatar.jpg';
      user.job = '暂无';
      user.introduce = '暂无';

      const userAuth = new UserAuth();
      userAuth.identifier = phone;
      userAuth.identity_type = identity_type;
      userAuth.credential = session.verifyCode;
      userAuth.user = user; // 和上述的user表信息关联

      // 因为之前在UserAuth映射对象做了manyToOne级联映射到User，所以只要保存user_auths表，user表的信息也会自动保存
      const resUserAuth = await userAuthRepo.save(userAuth); // resUserAuth就是新建的信息user_auths的用户数据
      const {
        user: { id, nickname, avatar },
      } = resUserAuth;
      // 把用户信息存在session中，实现登录状态
      session.userId = id;
      session.nickname = nickname;
      session.avatar = avatar;
      await session.save();
      // 设置cookie，用于登录持久化
      setCookie(cookies, { id, nickname, avatar });

      res.status(200).json({
        code: 0,
        msg: '登录成功',
        data: {
          userId: id,
          nickname,
          avatar,
        },
      });
    }
  } else {
    // 如果验证码输入错误
    res.status(200).json({
      code: -1,
      msg: '验证码错误',
    });
  }
}
